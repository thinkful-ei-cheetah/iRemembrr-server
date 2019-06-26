const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LL = require('../Algorithms/LinkedList');

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
      // needs to choose from the current word. 
      // for(let i=0; i< words.length; i++){
      //   if(words[i-1].id === words.word.id){
      //     head = {
      //       nextWord: words[i].original, 
      //       wordCorrectCount: words[i - 1].correct_count,
      //       wordIncorrectCount: words[i - 1].correct_count,
      //       totalScore: language.total_score,
      //     }
      //   }
      // }

      res
        .status(200)
        .json(head)
        .send()

      next()

    } catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    try {
      const {guess} = req.body;
      console.log(guess);

      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
    
      let isTrue = false;
    
      const mold = {
        answer: words[0].translation,
        isCorrect: isTrue,
        nextWord: words[0].original,
        totalScore: language.total_score,
        wordCorrectCount: words[0].correct_count,
        wordIncorrectCount: words[0].incorrect_count,
      }
 
      res
        .status(200)
        .json(mold)
        .send();

      next();

    } catch (error) {
      next(error)
    }

  })

module.exports = languageRouter;