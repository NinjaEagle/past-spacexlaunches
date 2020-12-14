import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

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
	}
}

export default function Home({ launches }) {
	console.log(launches)
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
							<div className={styles.card} key={launch.sys.id}>
								<Link href={'/launch/' + launch.sys.id}>
									<a>{launch.fields.name}</a>
								</Link>
							</div>
						))}
					</div>
				</main>
			</div>
		</div>
	)
}
