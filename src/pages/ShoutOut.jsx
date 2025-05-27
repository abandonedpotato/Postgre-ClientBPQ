import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";

const CONSTANT = {
  //API_BASE: "https://postgre-backendbpq.onrender.com/",
  //SOCKET_URL: "wss://postgre-backendbpq.onrender.com/ws"
  API_BASE: "https://golive.bigpotatoquiz.co.uk/",
  SOCKET_URL: "wss://golive.bigpotatoquiz.co.uk/ws"
};

const ShoutOut = () => {
  const [data, setData] = useState([]);

  // Fetch shoutouts from backend (always using selected_quiz_id)
  const getData = async () => {
    try {
      const res = await axios.get(CONSTANT.API_BASE + "getAllShoutOut");
      let parsed = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      // Only use parsed.data, do NOT filter further
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
  const ws = useMemo(() => new WebSocket(CONSTANT.SOCKET_URL), []);
  useEffect(() => {
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (["RESULT", "NEW_SHOUTOUT", "STATUS"].includes(data?.type)) {
        getData();
      }
    };
    return () => ws.close();
  }, [ws]);

  // Poll every 10 seconds as well
  useEffect(() => {
    getData();
    const intervalId = setInterval(() => getData(), 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Grid container spacing={2} sx={{ mb: '5rem', p: 2 }}>
      {data.map((item, idx) => {
        // Compatibility with original: show quiz id, comments
        // item[8] = comments (original had comma split), item[7] = quiz_id (for display)
        const comments = item[8] ? item[8].split("|") : [];
        return (
          <Grid item md={3} lg={3} sm={3} xs={12} key={item[0] || idx}>
            <Card sx={{ maxWidth: 345, height: "100%" }}>
              <CardHeader
                avatar={
                  <Avatar alt={item[2]} src={item[5] ? item[5] : `https://bpqcdn.co.uk/avatar/${item[1]?.trim()}.webp`} />
                }
                title={<Typography color="black" fontWeight={700}>{item[2]}</Typography>}
                subheader={<Typography color='blue' fontWeight={500}>{item[1]}</Typography>}
              />
              <CardContent>
                {comments && comments.map((comment, i) =>
                  <Typography key={i} variant="h6" color="black">{comment.trim()}</Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="black">Quiz: {item[7]}</Typography>
                <Typography variant="body2" color="black">{item[6]}</Typography>
                <Button onClick={() => deleteShoutOutComment(item[1])} variant='contained' color='error'>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ShoutOut;
