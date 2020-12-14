import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

let client = require('contentful').createClient({
	space: process.env.NEXT_CONTENTFUL_SPACE_ID,
	accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
})
export async function getStaticPaths() {
	let data = await client.getEntries({
		content_type: 'launch',
	})
	return {
		paths: data.items.map((item) => ({
			params: { id: item.sys.id },
		})),
		fallback: true,
	}
}
export async function getStaticProps({ params }) {
	console.log('params', params)
	let data = await client.getEntries({
		content_type: 'launch',
		'sys.id': params.id,
	})
	console.log(data)
	return {
		props: {
			launch: data.items[0],
		},
	}
}
export default function Launch({ launch }) {
	console.log(launch)
	let {
		launchDate,
		flightNumber,
		launchDetails,
		launchVideoUrl,
		missionPatchUrl,
		missionSuccess,
		name,
		rocketName,
		rocketType,
		webcastVideoUrl,
	} = launch.fields
	// convert date and time based on browser's local time
	// console.log('Launch Date', launchDate)
	let localDateTime = new Date(launchDate).toLocaleString().split(',')
	// embed video links
	let embedVideo = webcastVideoUrl.replace('watch?v=', 'embed/')
	console.log(embedVideo)

	//  src="https://www.youtube.com/embed/0a_00nJ_Y88"

	return (
		<div className={styles.details}>
			<div className={styles.backpage}>
				<ArrowBackIcon />
				<Link href={'/'}>Back </Link>
			</div>
			<div>
				<h1>{rocketName}</h1>
				<h3>Flight Number {flightNumber}</h3>
			</div>
			<div>
				<h3>Date Launched:</h3>
				{localDateTime[0]} at {localDateTime[1]}
				<h3> Was the mission a success? </h3>
				{missionSuccess ? 'YES' : 'NO'}
				<h3>Rocket Type:</h3>
				{rocketType}
				<h3>Launch Details: </h3>
				{launchDetails}
				<h3>Mission Path Picture</h3>
				<Image src={missionPatchUrl} width={200} height={200} />
				<h3>Launch Video</h3>
				<h3>Webcast Video</h3>
				<iframe
					width='560'
					height='315'
					src={embedVideo}
					frameborder='0'
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowfullscreen></iframe>
			</div>
		</div>
	)
}
