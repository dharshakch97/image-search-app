import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import "./index.css";
import { Button, Form } from 'react-bootstrap';

const API_URL = 'https://api.unsplash.com/search/photos';
const API_KEY = 'kOEZLUPTPWzkNIFgaF52EITWoDfdeCo-tri1pBLXfRI'

const images_per_page = 30

function App() {

	const searchInput = useRef(null)
	const [images, setImages] = useState([])
	const [totalPages, settotalPages] = useState(0)
	const [page, setPage] = useState(1)
	const [loading, setLoading] = useState(null)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchImages = useCallback(async () => {
		try {
			if (searchInput.current.value) {
				setLoading(true)
				const { data } = await axios.get(
					`${API_URL}?query=${searchInput.current.value}
					&page=${page}&per_page=${images_per_page}
					&client_id=${API_KEY}`
				)
				console.log(data)
				setImages(data.results)
				settotalPages(data.total_pages)
				setLoading(false)
			}
		}
		catch(e) {
			console.log(e)
			setLoading(false)
		}
	}, [page])

	useEffect(() => {
		fetchImages()
	}, [fetchImages])

	const resetSearch = () => {
		fetchImages()
		setPage(1)
	}

	const handleSearch = (e) => {
		e.preventDefault()
		console.log(searchInput.current.value)
		resetSearch()
	}
	
	const handleSelection = (selectedValue) => {
		searchInput.current.value = selectedValue
		resetSearch()
	}

	console.log('page',page)
	
	return (
		<div className='container'>
			<h1 className='title'>Image search</h1>
			<div className='search-section'>
				<Form onSubmit={handleSearch}>
					<Form.Control type='search' placeholder='Type something to search' 
						className='search-input' ref={searchInput} />
				</Form>
			</div>
			<div className='filters'>
				<div onClick={() => handleSelection('cricket')}>Cricket</div>
				<div onClick={() => handleSelection('india')}>India</div>
				<div onClick={() => handleSelection('pakistan')}>Pakistan</div>
				<div onClick={() => handleSelection('cwc2023')}>CWC2023</div>
			</div>
			{loading ? (
				<p className='loading'>Loading...</p>
			): (
				<>
					<div className='images'>
						{images.map((image) => (
							<img key={image.id} src={image.urls.small} 
								alt={image.alt_description} className='image' />		
						))}
					</div>
					<div className='buttons'>
						{page > 1 && <Button onClick={() => setPage(page-1)}>Previous</Button>}
						{page < totalPages && <Button onClick={() => setPage(page+1)}>Next</Button>}
					</div>
				</>
			)}
			
		</div>
	)
}

export default App
