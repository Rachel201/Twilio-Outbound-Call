import logo from './logo.svg';
import './App.css';
import useEffect from 'react'

function App() {
  useEffect(() => {
    axios.post("http://localhost:5000/token")
      .then((res) => {
        console.log(res.data)
      })
      // .then((data) => {
      //   console.log(data)
      //     // do something with the list here!
      // });
  }, []);
  return (
    <div>


    </div>
  );
}

export default App;
