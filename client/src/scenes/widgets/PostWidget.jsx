import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  BookmarkBorder,
  BookmarkOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Button,
  TextField,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import PostCategorizer from "./PostCategorizer";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import axios from "axios";
import CommentWidget from "./CommentWidget";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  saved
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [PostCategory, setPostCategory] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const isSaved = Boolean(saved[loggedInUserId])
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    try {
      const response = await axios.patch(
        `https://social-media-backend-4nur.onrender.com/posts/${postId}/like`,
        { userId: loggedInUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const updatedPost = response.data;
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error(error);
    }
  };

  const patchSave = async () => {
    try{
      const response = await axios.patch(
        `https://social-media-backend-4nur.onrender.com/posts/${postId}/save`,
        { userId: loggedInUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
        ,
        {body:{
          userId:loggedInUserId

        }}
      );
    const updatedPost = await response.data;
    dispatch(setPost({ post: updatedPost }));
  }catch(err){
    console.log(err)
  }
  };
  

  const postComment = async () => {
    try {
      const response = await axios.post(
        `https://social-media-backend-4nur.onrender.com/posts/${postId}/comment`,
        {
          userId: loggedInUserId,
          comment: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { message } = response.data;
      console.log(message); // Log the response message
      setNewComment(""); // Clear the comment input field after posting
    } catch (error) {
      console.error(error);
    }
  };

  const addComment = () => {
    postComment();
  };

  useEffect(() => {
    if (isComments) {
      axios
        .get(`https://social-media-backend-4nur.onrender.com/posts/${postId}/get/comment`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPostComments(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isComments, postId, token]);

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description.includes(".com") ? (
          <Button
            onClick={() => window.open(description, "_blank")}
            variant="contained"
            style={{
              cursor: "pointer",
            }}
          >
            Best Buy Link
          </Button>
        ) : (
          <p>{description}</p>
        )}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="280px"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://social-media-backend-4nur.onrender.com/assets/${picturePath}`}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>
              {postComments ? postComments.length : comments.length}
            </Typography>
          </FlexBetween>
          <IconButton onClick={patchSave}>
            {isSaved ? <BookmarkOutlined /> : <BookmarkBorder />}
          </IconButton>

        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <FlexBetween gap="1rem">
            <TextField
              id="outlined-basic"
              label="Add a comment"
              variant="outlined"
              size="small"
              sx={{
                width: "100%",
                borderRadius: "20px", // Adjust the value as per your preference
              }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={addComment}
              style={{
                cursor: "pointer",
                borderRadius: "8px", // Adjust the value as per your preference
              }}
            >
              Add
            </Button>
          </FlexBetween>
          <Box mt="1rem">
            {postComments?.map((comment, index) => (
              <FlexBetween key={index} mt="0.5rem">
                {console.log(comment)}
                <CommentWidget
                  commenterName={comment.commenterName}
                  comment={comment.comment}
                  userImage={comment.commenterProfilePic}
                />
              </FlexBetween>
            ))}
          </Box>
        </Box>
      )}

    </WidgetWrapper>
  );
};

export default PostWidget;
