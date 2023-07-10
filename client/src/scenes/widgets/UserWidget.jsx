import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  CheckCircleRounded ,
  OpenInFull 
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, TextField } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import axios from 'axios'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { _id } = useSelector((state) => state.user);
  const [ currentUser, setCurrentUser] = useState('')
  const [InputBox, setInputBox] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;


  const getUser = async () => {
    const response = await fetch(`https://social-media-backend-4nur.onrender.com/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };


  const updateUser = async () => {
    try {
      const response = await axios.patch(
        `https://social-media-backend-4nur.onrender.com/users/${userId}`,
        { twitter, linkedIn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  useEffect(() => {
    getUser();
  localStorage.setItem('userId', userId)
  const cu = localStorage.getItem('userId')
  setCurrentUser(cu)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    twitter,
    linkedIn
  } = user;
  const handleSubmit = () => {
    updateUser()
    setInputBox(false)
   }
   const handleTwitterEdit = () => {
    setUser((prev) => ({
      ...prev,
      twitter
    }));
    
  };
  
  const ProfileId = window.location.pathname.split("/").pop()

  // const handleLinkedInEdit = () =>{
  //   setInputBox(!InputBox)
  // }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  
  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

    </WidgetWrapper>
  );
};

export default UserWidget;