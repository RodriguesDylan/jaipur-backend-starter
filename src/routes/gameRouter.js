import express from "express"
import * as gameService from "../services/gameService"
import * as databaseService from "../services/databaseService"

const router = express.Router()

// Listen to POST /games
router.post("/", function (req, res) {
  if (!req.body.name) {
    return res.status(400).send("Missing name parameter")
  }
  const newGame = gameService.createGame(req.body.name)
  res.status(201).json(newGame)
})

// Listen to GET /games
router.get("/", function (req, res) {
  const listOfGames = databaseService.findAllGames()
  if (listOfGames.length === 0) {
    return res.status(404).send("No game found")
  }
  res.status(200).json(listOfGames)
})

// Listen to GET /games/[id]
router.get("/:id", function (req, res) {
  const game = databaseService.findOneGameById(parseInt(req.params.id))
  if (!game) {
    return res.status(404).send("Game not found")
  }
  res.status(200).json(game)
})

export default router

router.put("/:id/take-camels", function (req, res) {
  if (!req.params.id) {
    return res.status(400).send("Missing id")
  }
  if (!req.header("playerIndex")) {
    return res.status(400).send("Missing header playerIndex")
  }

  const gameId = Number.parseInt(req.params.id)
  const playerIndex = Number.parseInt(req.header("playerIndex"))

  const game = databaseService.findOneGameById(gameId)

  if (!game) {
    return res.status(404).send("Game not found")
  }
  if (game.currentPlayerIndex !== playerIndex) {
    console.log(game.currentPlayerIndex)
    return res.status(403).send("Wrong player")
  }

  gameService.takeCamels(game, playerIndex)

  return res.status(200).send(game)
})
