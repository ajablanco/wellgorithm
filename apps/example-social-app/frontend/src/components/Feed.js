import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_TIMELINE, EXPLORE_PUBLICATIONS } from "../utils/queries";
import Post from "../components/Post";

function Feed({ profile = {}, isExplore }) {
    const [publications, setPublications] = useState([]);

    const [getTimeline, timelineData] = useLazyQuery(GET_TIMELINE);
    const [explorePublications, explorePublicationsData] = useLazyQuery(EXPLORE_PUBLICATIONS);

    useEffect(() => {
        if (!profile.id || isExplore) {
            if (publications.length > 0) return;
            explorePublications({
                variables: {
                    request: {
                        sortCriteria: 'TOP_COLLECTED',
                        limit: 10,
                    },
                    reactionRequest: profile.id ? { profileId: profile.id } : null,
                },
            })
            return
        };

        if (isExplore) return;
        getTimeline({
            variables: {
                request: { profileId: profile.id },
                reactionRequest: { profileId: profile.id },
            },
        })
    }, [getTimeline, profile])

    useEffect(() => {
        if (!timelineData.data) return;

        if (timelineData.data.timeline.items.length < 1) {
            return;
        }

        // console.log('timeline loaded')

        const pubIds = {}
        const pubs = []

        timelineData.data.timeline.items.forEach((post) => {
            if (pubIds[post.id]) return;
            else {
                pubIds[post.id] = true
                pubs.push(post)
            }
        })

        setPublications(pubs);
        
    }, [timelineData.data]);

    useEffect(() => {
        if (profile.id && !isExplore) return;
        if (!explorePublicationsData.data) return;

        if (publications.length > 0) return;

        if (explorePublicationsData.data.explorePublications.items.length < 1) {
            return;
        }

        setPublications(explorePublicationsData.data.explorePublications.items);
    }, [explorePublicationsData.data]);

    return (
        <div>
            {!profile.id && <h3>Popular Posts</h3>}
            {publications.map((post) => {
                return <Post key={post.id} post={post} profileId={profile.id} />;
            })}
        </div>
    );
}

export default Feed;
