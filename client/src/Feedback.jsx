import { useState } from 'react'

function Feedback() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          rating,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('Feedback submitted successfully!')
        setName('')
        setEmail('')
        setRating(5)
        setMessage('')
      } else {
        setStatus(data.message || 'Failed to submit feedback.')
      }
    } catch (error) {
      setStatus('Unable to connect to server.')
    }
  }

  return (
    <div className="feedback-container">
      <h1>Placement Portal Feedback</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Average</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div>
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit Feedback</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  )
}

export default Feedback