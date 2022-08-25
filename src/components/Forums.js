import { useNavigate, Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from '../App';

import plantCare from '../images/watering-plants.jpg';
import plantswap from '../images/plant-swap.jpg';

export default function Forums() {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    //check if user has logged in, if not, redirect them to login page
    if (Object.keys(user) == 0) {
      navigate('/login');
    }
  });

  // const addPost = () => {
  //   console.log('redirecting to new post page');
  // };

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
            navigate('/forumnewsfeed');
          }}
        >
          Enter Plant Care
        </button>
        <h4>Buy Sell Trade Corner (Link to Forum thread)</h4>
        <img src={plantswap} alt="" width="500" height="500" />
        <br />
        <button
          onClick={() => {
            navigate('/forumtrading');
          }}
        >
          Enter Trading Post
        </button>
      </div>
      <br />

      {/* <button
        onClick={() => {
          navigate('/forumnewsfeed');
        }}
      >
        Add Forum Post
      </button> */}
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
