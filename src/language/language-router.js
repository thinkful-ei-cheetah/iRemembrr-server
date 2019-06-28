const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { fillLinkedList, answerTrue, moveHead } = require('./language-LL-service')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      let head = {
        nextWord: words[0].original,
        wordCorrectCount: words[0].correct_count,
        wordIncorrectCount: words[0].correct_count,
        totalScore: language.total_score,
      }

      res
        .status(200)
        .json(head)

    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    let guess = req.body.guess;
    try {
      if (!guess) {
        res.status(400)
        next()
      }
      let db = req.app.get('db');

      const language = await LanguageService.getUsersLanguage(
        db,
        req.user.id,
      )
      const words = await LanguageService.getLanguageWords(
        db,
        req.language.id,
      )

      let list = fillLinkedList(words);
      let isTrue = answerTrue(list, guess);
      let totalScore = language.total_score;
      if (isTrue === true) {
        totalScore = totalScore + 1;
      }

      await db('language')
        .where('id', language.id)
        .update({
          total_score: totalScore
        })


        db.transaction(trx => {
          let current = list.getAt(0)
          const queries = [];
          while (current.next !== null) {
            current = current.next;
            const query = db('word')
              .where('id', current.value.id)
              .update({
                original: current.value.original,
                translation: current.value.translation,
                next: current.value.next,
                memory_value: current.value.memory_value,
                correct_count: current.value.correct_count,
                incorrect_count: current.value.incorrect_count,
              })
              .transacting(trx);
            queries.push(query);
          }
          Promise.all(queries)
            .then(trx.commit)
            .catch(trx.rollback)
        })


      let word = list.getAt(0).value;
      console.log(word)
      const response = {
        answer: word.translation,
        isCorrect: isTrue,
        nextWord: word.next,
        totalScore: language.total_score,
        wordCorrectCount: word.correct_count,
        wordIncorrectCount: word.incorrect_count,
      }

      let m = list.getAt(0).value.memory_value;
      if (m > words.length) {
        m = words.length - 1;
      }
      moveHead(list, m);

      res
        .status(200)
        .json(response)


    } catch (error) {
      next(error)
    }
  })

module.exports = languageRouter;