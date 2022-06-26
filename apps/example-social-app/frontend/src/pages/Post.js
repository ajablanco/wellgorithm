import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'
import { GET_PUBLICATION, GET_PUBLICATIONS } from '../utils/queries'
import PostComponent from '../components/Post'
import Compose from '../components/Compose'
import { useWallet } from '../utils/wallet'

function Post({ profileId, profileName }) {
    const { wallet } = useWallet()
    let params = useParams();
    const [publication, setPublication] = useState({})
    const [notFound, setNotFound] = useState(false)
    const [comments, setComments] = useState([]);
    const [isCommunity, setIsCommunity] = useState(false)

    const [getPublication, publicationData] = useLazyQuery(GET_PUBLICATION)
    const [getPublications, publicationsData] = useLazyQuery(GET_PUBLICATIONS);

    useEffect(() => {
        getPublication({
            variables: {
                request: { publicationId: params.postId },
                reactionRequest: profileId ? { profileId } : null,
            },
        });
    }, [profileId])

    useEffect(() => {
        if (!publicationData.data) return;
        if (!publicationData.data.publication) {
            setNotFound(true)
            return
        };

        setPublication({...publication, ...publicationData.data.publication})
        publicationData.data.publication.metadata?.attributes.forEach(attribute => {
            if(attribute.value === 'community') {
                setIsCommunity(true)
            }
        })
    }, [publicationData.data])
    
    useEffect(() => {
        getPublications({
            variables: {
                request: {
                    commentsOf: params.postId
                },
            },
        });
    }, [getPublications, params.postId])

    
    useEffect(() => {
        if (!publicationsData.data) return;

        setComments(publicationsData.data.publications.items);

    }, [wallet.address, publicationsData.data]);

    return (
        <>
            {notFound && <h3>No Post Found</h3>}
            {publication.metadata && <PostComponent post={publication} profileId={profileId} />}
            <Compose
                profileId={profileId}
                profileName={profileName} 
                cta='Comment'
                placeholder='Type your comment'
                replyTo={params.postId}
                isCommunity={isCommunity}
                isComment={!isCommunity}
            />
            {comments.length > 0 && <h3>Comments</h3>}
            {comments.map((post) => {
                return <PostComponent key={post.id} post={post} profileId={profileId} isCommunityPost={isCommunity} />;
            })}
        </>
    );
}

export default Post
