import { Box, useMediaQuery, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import { PhotoAlbumOutlined } from "@mui/icons-material";
import PostsWidget from "scenes/widgets/PostsWidget";
import PostWidget from "scenes/widgets/PostWidget";

const SavedPage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { userId } = useParams();
    const { _id, picturePath } = useSelector((state) => state.user);

    return (
        <Box>
          <Navbar />
          <Box
            width="100%"
            padding="2rem 6%"
            display={isNonMobileScreens ? "flex" : "block"}
            gap="0.5rem"
            justifyContent="space-between"
          >
            <Box
              flexBasis={isNonMobileScreens ? "42%" : undefined}
              mt={isNonMobileScreens ? undefined : "2rem"}
            >
              <PostsWidget userId={userId} isSaved/>
            </Box>
          </Box>
        </Box>
      );
    };

export default SavedPage;
