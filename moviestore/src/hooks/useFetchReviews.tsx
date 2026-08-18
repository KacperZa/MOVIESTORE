import { useEffect, useState } from 'react'

interface FetchReviewsProps {
    type: string | undefined
    id: string | undefined
}

interface Author {
    name: string
    username: string
    avatar_path: string
    rating: string
}

interface Review {
    author: string
    author_details: Author
    content: string
    created_at: string
    id: string
    updated_at: string
    url: string

}

const useFetchReviews = ({type, id} : FetchReviewsProps) => {
    const [reviews, setReviews] = useState<Review>()

    useEffect(() => {
        const fetchReviews = async() => {
            try {
                const res = await fetch(`http://localhost:5000/reviews/${type}/${id}`,{
                        method: 'GET'
                    });
                if(!res.ok) throw new Error(`HTTP error: ${res.status}`)
    
                const data = await res.json()
                setReviews(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchReviews()
    },[type, id])

  return reviews
}

export default useFetchReviews