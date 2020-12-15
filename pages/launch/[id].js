import Image from 'next/image'
import styles from '../../styles/Home.module.css'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useRouter } from 'next/router'

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
	const router = useRouter()
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
	let localDateTime = new Date(launchDate).toLocaleString().split(',')
	// embed video links
	// if (launchVideoUrl != null && launchVideoUrl != '') {
	let embedLaunchVid = launchVideoUrl
		? launchVideoUrl.replace('watch?v=', 'embed/')
		: null
	// }
	let embedWebcastVid = webcastVideoUrl.replace('watch?v=', 'embed/')

	//  src="https://www.youtube.com/embed/0a_00nJ_Y88"
	const handleClick = (e) => {
		e.preventDefault()
		router.push('/')
	}
	return (
		<div className={styles.details}>
			<div className={styles.backpage}>
				<button onClick={handleClick} className={styles.button} type='button'>
					<ArrowBackIcon />
					<h3>Back</h3>
				</button>
			</div>
			<div className={styles.title}>
				<h1>{rocketName}</h1>
				<h3>Flight Number {flightNumber}</h3>
			</div>
			<div>
				<div className={styles.info}>
					<h3>Date Launched</h3>
					{localDateTime[0]} at {localDateTime[1]}
				</div>
				<div className={styles.info}>
					<h3> Was the mission a success?</h3>
					{missionSuccess ? 'YES' : 'NO'}
				</div>
				<div className={styles.info}>
					<h3>Rocket Type</h3>
					{rocketType}
				</div>
				<div className={styles.info}>
					{launchVideoUrl ? (
						<div>
							<h3>Launch Details</h3>
							{launchDetails}
						</div>
					) : null}
				</div>
				<div className={styles.info}>
					<h3>Mission Path Logo</h3>
					<Image src={missionPatchUrl} width={200} height={200} />
				</div>
				<div className={styles.info}>
					{embedLaunchVid ? (
						<div>
							<h3>Launch Video</h3>
							<iframe
								width='560'
								height='315'
								src={embedLaunchVid}
								frameBorder='0'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen></iframe>
						</div>
					) : null}
				</div>
				<div className={styles.info}>
					{webcastVideoUrl ? (
						<div>
							<h3>Webcast Video</h3>
							<iframe
								width='560'
								height='315'
								src={embedWebcastVid}
								frameBorder='0'
								allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen></iframe>
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}
