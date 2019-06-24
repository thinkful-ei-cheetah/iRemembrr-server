const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

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
    try{
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
        // NOT DONE NEED TO FIGURE OUT HOW TO GO THROUGH LIST BETTER. 
      const head = {
        nextWord: words[0].original, // MAKE SURE TO LOOK AT WORDS
        wordCorrectCount: words[language.head - 1].correct_count,
        wordIncorrectCount: words[language.head -1].correct_count,
        totalScore: language.total_score,
 
      }
     
      res
        .status(200)
        .json(head)
        .send()
      
      next()

    } catch (error){
      next(error)
    }
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    // implement me
    res.send('implement me!')
  })



module.exports = languageRouter;