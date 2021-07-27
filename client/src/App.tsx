import React, { useState } from "react";
import Dialer from "./dialer/Dialer";
import "./App.css";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function App() {
  
  const [value, setValue] = useState("")
  const [isConnect,setIsConnect]=useState(false)

  const handleConnect=()=>{
    setIsConnect(true)
  }
  return(
    <div className="continar">
      <div className='input-phone'>
    <PhoneInput
      placeholder="Enter phone number"
      value={value}
      onChange={setValue}
      />
      <button  onClick={handleConnect}>conect</button> 
     </div >
     <div >
         { isConnect ?<Dialer phoneNumber={value}/>:"hello"} 
    </div>
    </div>
  );
}

export default App;