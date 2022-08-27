import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';

import plantCare from '../images/watering-plants.jpg';
import plantswap from '../images/plant-swap.jpg';

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

  return (
    <div>
      <div>
        <ul className="navigationBar">
          <li className="navigationBarItem">
            <Link to={'/'}>Dashboard</Link>
          </li>
          <li>{user ? <p>{user.displayName}</p> : null}</li>
        </ul>
      </div>
      <h1>Forums</h1>

      <div className="forum-pages">
        <h4>Plant Care Tips (Link to Forum thread)</h4>
        <img src={plantCare} alt="" width="500" height="500" />
        <br />
        <button
          onClick={() => {
            setCurrForum('/forumTips');

            navigate('/forums/forumTips');
            console.log(currForum);
          }}
        >
          Enter Plant Care
        </button>
        <h4>Buy Sell Trade Corner (Link to Forum thread)</h4>
        <img src={plantswap} alt="" width="500" height="500" />
        <br />
        <button
          onClick={() => {
            setCurrForum('/forumTrading');
            navigate('/forums/forumTrading');
            console.log(currForum);
          }}
        >
          Enter Trading Post
        </button>
      </div>
      <br />

      <div>
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
    </div>
  );
}
