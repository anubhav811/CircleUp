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
import { get } from "lodash";
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
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [PostCategory, setPostCategory] = useState(false)
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/posts/${postId}/like`,
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

  const postComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/comment`,
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

  const handleShare = () => {
    const postUrl = `http://localhost:3000/posts`;
    navigator.clipboard.writeText(postUrl);
  };

  useEffect(() => {
    if (isComments) {
      axios
        .get(`http://localhost:3001/posts/${postId}/get/comment`, {
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
          src={`http://localhost:3001/assets/${picturePath}`}
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

          {!window.location.pathname.includes("saved") && (
            <IconButton onClick={() => setPostCategory(!PostCategory)}>
              {PostCategory ? (
                <BookmarkBorder sx={{ color: primary }} />
              ) : (
                <BookmarkBorder />
              )}
            </IconButton>
          )}
        </FlexBetween>
        <IconButton onClick={handleShare}>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          <FlexBetween gap="1rem">
            <TextField
              id="outlined-basic"
              label="Add a comment"
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={addComment}
              style={{
                cursor: "pointer",
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
                    comment = {comment.comment}
                    userImage={comment.commenterProfilePic}
                    />
                </FlexBetween>
              ))}
  

        </Box>
        </Box>
      )}

      <Box mt="0.5rem">
        {PostCategory && (
          <PostCategorizer
            postId={postId}
            likes={likes}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            name={name}
            description={description}
            location={location}
            comments={comments}
          />
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default PostWidget;
