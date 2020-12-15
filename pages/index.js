import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'

let client = require('contentful').createClient({
	space: process.env.NEXT_CONTENTFUL_SPACE_ID,
	accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN,
})
export async function getStaticProps() {
	let data = await client.getEntries({
		content_type: 'launch',
	})
	return {
		props: {
			launches: data.items,
		},
		revalidate: 1,
	}
}

export default function Home({ launches }) {
	const router = useRouter()

	const handleClick = (launch) => {
		router.push('/launch/' + launch.sys.id)
	}
	return (
		<div className={styles.container}>
			<div>
				<Head>
					<title>Past Space X Launches</title>
					<link rel='icon' href='/favicon.ico' />
				</Head>

				<main className={styles.main}>
					<h1>Past Space X Launches</h1>
					<div className={styles.grid}>
						{launches.map((launch) => (
							<button
								onClick={() => handleClick(launch)}
								className={styles.card}
								key={launch.sys.id}
								type='button'>
								{/* <Link href={'/launch/' + launch.sys.id}>
									<a className={styles.linkname}>{launch.fields.name}</a>
								</Link> */}
								<h3>{launch.fields.name}</h3>
								<p>{new Date(launch.fields.launchDate).toLocaleString().split(',')}</p>
							</button>
						))}
					</div>
				</main>
			</div>
		</div>
	)
}
