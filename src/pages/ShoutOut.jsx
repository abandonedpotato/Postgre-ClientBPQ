import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CONSTANT = {
  API_BASE: "https://postgre-backendbpq.onrender.com/",
  SOCKET_URL: "wss://postgre-backendbpq.onrender.com/ws"
};

const ShoutOut = () => {
  const [data, setData] = useState([]);

  // Fetch shoutouts from backend (always using selected_quiz_id)
  const getData = async () => {
    try {
      const res = await axios.get(CONSTANT.API_BASE + "getAllShoutOut");
      let parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (parsed?.data) setData(parsed.data);
    } catch (err) {
      console.error("Error fetching shoutouts:", err);
    }
  };

  const deleteShoutOutComment = async (id) => {
    try {
      const res = await axios.post(CONSTANT.API_BASE + "deleteshoutrecord", { id });
      const result = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      if (result?.data?.status === "success") {
        getData();
      }
    } catch (err) {
      console.error("Error deleting shoutout:", err);
    }
  };

  // WebSocket to auto-update on result/shoutout/status
  const ws = useMemo(() => new WebSocket(CONSTANT.SOCKET_URL+`/${Date.now()}`), []);
  useEffect(() => {
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (["RESULT", "NEW_SHOUTOUT", "STATUS"].includes(data?.type)) {
        getData();
      }
    };
    return () => ws.close();
  }, [ws]);

  // Poll every 3 seconds as well
  useEffect(() => {
    getData();
    const intervalId = setInterval(() => getData(), 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Grid container spacing={2} sx={{ mb: '5rem', p: 2 }}>
      {data.map((item, idx) => {
        const comments = item[8] ? item[8].split("|") : [];
        return (
          <Grid item md={3} lg={3} sm={3} xs={12} key={item[0] || idx}>
            <Card sx={{ maxWidth: 345, height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar alt={item[2]} src={item[5] ? item[5] : `https://bpqcdn.co.uk/avatar/${item[1]?.trim()}.webp`} />
                }
                action={
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => deleteShoutOutComment(item[1])}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                title={<Typography color="black" fontWeight={700}>{item[2]}</Typography>}
                subheader={<Typography color='blue' fontWeight={500}>{item[1]}</Typography>}
              />
              <CardContent>
                {comments && comments.map((comment, i) =>
                  <Typography key={i} variant="h6" color="black">{comment.trim()}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ShoutOut;
