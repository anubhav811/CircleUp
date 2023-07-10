import { Box, Typography } from "@mui/material";
import UserImage from "components/UserImage";

const CommentWidget = ({ commenterName, comment, userImage }) => {
  return (
    <Box display="flex" alignItems="center" mb={1}>
      <UserImage image={userImage} size="40px" />
      <Box ml={1}>
        <Typography variant="body2" fontWeight="bold">
          {commenterName}
        </Typography>
        <Typography variant="body2">{comment}</Typography>
      </Box>
    </Box>
  );
};

export default CommentWidget;
