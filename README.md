<img width="1476" alt="Screen Shot 2022-06-26 at 6 08 04 AM" src="https://user-images.githubusercontent.com/59661417/175809299-3ec14877-cd63-4d93-8ef8-19d8aecf175c.png">

# THE WELLGORITHM- the protocol that lets you own your algorithm.
### Save, Share, Customize, or Mint your Algorithm

# Installation
*frontend* <br/>
`cd apps/frontend` <br/>
`npm i`<br/>
`npm run dev`<br/>

*example-social-app*<br/>
`cd apps/example-social-app/frontend` <br/>
`npm i`<br/> 
add to .env file <br/>
`'SKIP_PREFLIGHT_CHECK=true'` <br/>
`'PORT=4783'` <br/>
`npm run start`<br/>


# How it Works
We have built a custom ‘wellgorize’ algorithm that will automatically sort incoming lens publications. Apps that use our protocol are encouraged to build front-end solutions that have visually similar experiences to TikTok’s ‘for you page’ or Instagram’s ‘explore’ page with our sorting protocol. Our individual users data models will be stored on Privy. & User interactions and events on any lens publications will be captured through our custom-built analytics tooling and stored in IPFS. We're leveraging the new browser-based IPFS implementation which has the potential to introduce anyone with a web browser to IPFS, we are also leveraging the latest IPLD data types such as JWE's and JWS's to then store user generated data encrypted onto IPFS via Ceramic, and using novel browser session based key-pair generation to be the DID identity in a way that is secure, but still recoverable by the end user. The combination of these qualities represents an unexplored approach to leveraging IPFS paired with Filecoin provides a durable haven for users sensitive and important personal data, especially what we generate with our protocol.

# Compatible Apps 
### LensFrens
### Lenster
### Phaver
### Alphs Finance
### Iris (Example `For You` Page below)
<img width="326" alt="Screen Shot 2022-06-26 at 6 13 10 AM" src="https://user-images.githubusercontent.com/59661417/175809489-7e6a2e3f-7fdb-4a77-996d-86016aaca8c3.png">
<img width="1044" alt="Screen Shot 2022-06-26 at 6 13 04 AM" src="https://user-images.githubusercontent.com/59661417/175809491-6d50d776-9a80-400c-98a0-fc4d5cda86b6.png">
