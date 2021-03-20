import {useState, useCallback} from 'react'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, method = 'GET', body = null, headers ={}) => {
    setLoading(true)
    try {
      if(body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = "application/json"
      }

      const response = await fetch(url, {
        method, 
        body, 
        headers
      })

      // console.log(response.status)

      const data = {body : await response.json(), status : await response.status} 

      // console.log(data)

      if(!response.ok) {
        throw new Error(data.body.message || "why")
      }
      setLoading(false)
      return data

    } catch(e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError}
}