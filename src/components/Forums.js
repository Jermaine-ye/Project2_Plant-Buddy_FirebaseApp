import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Image,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { UserContext } from '../App';

import tipspic from '../images/TipsForum.png';
import tradingpic from '../images/TradingForum.png';

export default function Forums() {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [currForum, setCurrForum] = useState('');

  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate('/login');
    }
  });

  let forumTipsCard = (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={tipspic} height={600} alt="forumtipsicon" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={300}>Plant Care Tips</Text>
      </Group>

      <Text size="sm" color="dimmed">
        This forum is for fellow Bud-dies to come together to share green tips
        and reach out when they need help!
      </Text>
      <Button
        variant="light"
        color="blue"
        size="md"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          setCurrForum('/forumTips');
          navigate('/forums/forumTips');
          console.log(currForum);
        }}
      >
        Enter Plant Care
      </Button>
    </Card>
  );

  let forumTradingCard = (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={tradingpic} height={600} alt="forumtradesicon" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={300}>Let's Trade Plants!</Text>
      </Group>

      <Text size="sm" color="dimmed">
        This forum is for people who are interested in sharing and swapping
        plants and seedlings, share the joy!!
      </Text>
      <Button
        variant="light"
        color="blue"
        size="md"
        fullWidth
        mt="md"
        radius="md"
        onClick={() => {
          setCurrForum('/forumTrading');
          navigate('/forums/forumTrading');
          console.log(currForum);
        }}
      >
        Enter Trading Room
      </Button>
    </Card>
  );

  return (
    <div>
      <ul className="navigationBar">
        <li className="navigationBarItem">
          <Link to={'/'}>Dashboard</Link>
        </li>
        <li>{user ? <p>{user.displayName}</p> : null}</li>
      </ul>
      <h1>Forums</h1>
      <Grid>
        <Grid.Col md={6} lg={6}>
          {forumTipsCard}
        </Grid.Col>
        <Grid.Col md={6} lg={6}>
          {forumTradingCard}
        </Grid.Col>
      </Grid>
      <ul className="navigationBar">
        <li className="navigationBarItem">
          <Link to={'/community'}>Community</Link>
        </li>
        <li className="navigationBarItem">
          <Link to={'/forums'}>Forums</Link>
        </li>
        <li className="navigationBarItem">
          <Link to={'/recommendations'}>Recommendations</Link>
        </li>
      </ul>
    </div>
  );
}
