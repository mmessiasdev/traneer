import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/header";
import DefaultTitle from "../../components/title";
import YouTube from 'react-youtube';
import Button from '@mui/material/Button';
import Footer from "../../components/footer";
import Logo from '../../assets/logo.png';




const Course = () => {
    const token = localStorage.getItem('authToken');
    const { id } = useParams();

    const [initialVideo, setInitialVideo] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [initialYoutubePlaylist, setInitialYoutubePlaylist] = useState(null);
    const [playlistItems, setPlaylistItems] = useState(null);
    const [videoId, setVideoId] = useState(null);

    const styles = {
        wallpaperImage: {
            objectFit: "contain",
            width: "100%"

        }
    };

    const opts = {
        height: '500px',
        width: '100%',
        playerVars: {
            autoplay: 1,
            controls: 1, // Remover controles do player
            showinfo: 1,
            modestbranding: 0,
            iv_load_policy: 0,
            enablejsapi: 0,
            color: "white",
        },
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const initialVideoResponse = await axios.get(`${process.env.REACT_APP_BASEURL}/api/courses/${id}?populate=*`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': true

                    }
                });

                const playlistId = initialVideoResponse.data.data.attributes.playlistid;

                const youtubePlaylistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${process.env.REACT_APP_YOUTUBEKEY}`, {
                    headers: {
                        'Content-Type': 'application/json'

                    }
                });
                const playlistItensResponse = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.REACT_APP_YOUTUBEKEY}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });


                setInitialVideo(initialVideoResponse.data.data);

                setInitialYoutubePlaylist(youtubePlaylistResponse.data.items[0].snippet);
                setPlaylistItems(playlistItensResponse.data.items);
                setDataLoaded(true);
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        };

        fetchData();
    }, [token]);

    const handleVideoChange = (newVideoId) => {
        setVideoId(newVideoId);
    };

    useEffect(() => {
        let timeoutId;

        if (!dataLoaded) {
            timeoutId = setTimeout(() => {
                window.location.reload();
            }, 5000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [dataLoaded]);




    return <div>
        <Header logo={"https://connectba.com.br/core/views/860ad119c2/assets/img/logo.png"} />

        {
            initialVideo ? (
                <div>
                    <Box sx={{ width: "100%", padding: { md: "0px 150px", xs: "0px 10px" } }}>
                        <DefaultTitle text={initialVideo.attributes.title} />
                        <Box display="flex" flexDirection="flex" width="100%" marginTop="50px">
                            <Box display="flex" width="100%" alignItems="start" justifyContent="start" overflow="hidden">
                                {
                                    videoId ? <Box width="100%" > <YouTube opts={opts} videoId={videoId} />
                                        <Box marginTop="25px"> <Typography variant="h4">{initialYoutubePlaylist.description}</Typography></Box></Box> : <img style={styles.wallpaperImage} src={initialYoutubePlaylist ? initialYoutubePlaylist.thumbnails.maxres.url : ""} />
                                }
                            </Box>
                            <Box width="100px" />
                            <Box width="50%">
                                {
                                    dataLoaded ? (
                                        <>
                                            {playlistItems.map(item => (
                                                <Button style={{ width: "100%", borderRadius: "15px" }} variant="text" onClick={() => handleVideoChange(item.snippet.resourceId.videoId)}>
                                                    <Box color="background.dark" display="flex" alignItems="center" padding="10px 25px" height="80px" width="100%" bgcolor="secondary.main" borderRadius="15px">
                                                        <Typography variant="h3"> {playlistItems ? item.snippet.title : ""} </Typography>
                                                    </Box>

                                                </Button>
                                                // <div key={item.id} className="playlist-item">
                                                //     <h2>{item.snippet.title}</h2>
                                                //     <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
                                                //     {/* Adicione mais informações ou elementos conforme necessário */}
                                                // </div>
                                            ))}
                                        </>
                                    ) : <div></div>
                                }

                            </Box>
                        </Box>
                    </Box>
                    <Footer />

                </div>

            ) : (
                <Box sx={{ justifyContent: "center", display: "flex", width: "100%", padding: "100px 15px" }}> <p>Carregando...</p> </Box >
            )
        }
    </div>
}

export default Course;