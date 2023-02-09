const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()
const pool = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
app.use(cors())

// get all discs
app.get('/discs/:userEmail', async (req, res) => {
  const { userEmail } = req.params
  try {
    const data = await pool.query('SELECT * FROM discs WHERE user_email = $1', [userEmail])
    data.rows.forEach(disc => {
      disc.speed = Number(disc.speed)
      disc.glide = Number(disc.glide)
      disc.turn = Number(disc.turn)
      disc.fade = Number(disc.fade)
    });

    res.json(data.rows);
    // console.log(data.rows)

  } catch (err) {
    console.log(err)
  }
})

//create a new disc
app.post('/disc', async (req,res) => {
  const { user_email, img_encoded, stability, category, brand, name, speed, glide, turn, fade, date } = req.body
  console.log(user_email, img_encoded, stability, category, brand, name, speed, glide, turn, fade, date)
  const id = uuidv4()
  try {
    const newDisc = await pool.query('INSERT INTO discs(id, user_email, img_encoded, stability, category,	brand, disc_name, speed, glide, turn, fade, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [id, user_email, img_encoded, stability, category, brand, name, speed, glide, turn, fade, date])
    res.json(newDisc)
  } catch (err) {
    console.log(err)
  }
})

//edit a todo
app.put('/disc/:id', async (req, res) => {
  const { id } = req.params 
  const { myFile } = req.body
  try {
    const editDisc = await pool.query('UPDATE discs SET img_encoded = $1 WHERE id = $2;', [myFile, id])
    res.json(editDisc)
  } catch (err) {
    console.log(err)
  }
})

//delete a disc 
app.delete('/disc/:id', async (req, res) => {
  const { id } = req.params
  try {
    const deleteToDo = await pool.query('DELETE FROM discs WHERE id = $1;', [id])
    res.json(deleteToDo)
  } catch (err) {
    console.log(err)
  }
})

// signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)
  
  try {
    const signUp = await pool.query(`INSERT INTO users (email, hashed_password) VALUES($1, $2)`,[email, hashedPassword])

    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

    res.json({ email, token })
  } catch (err) {
    console.log(err)
    if (err) {
      res.json({ detail: err.detail })
    }
  }
})

// login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    
    if (!users.rows.length) return res.json({ detail : 'User does not exist!' })

    const success = await bcrypt.compare(password, users.rows[0].hashed_password)
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr'})

    if (success) {
      res.json({ 'email' : users.rows[0].email, token})
    } else {
      res.json({ detail: "Login failed"})
    }
  } catch (err) {
    console.log(err)
  }
})



app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))

