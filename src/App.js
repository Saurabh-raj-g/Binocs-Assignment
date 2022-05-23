import './aap.css';
import {useEffect, useState} from "react";
import readXlsxFile from "read-excel-file";
import * as XLSX from "xlsx";
import Chart from "react-apexcharts";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


function App() {
    
    const [Data, setData] = useState();
    const [startDate, setStartDate] = useState(new Date("4/9/2018"));
    const [endDate, setEndDate] = useState(new Date("3/13/2022"));
    const [transaction, setTransaction] = useState([]);
    const [coins, setCoins] = useState([]);

    const [numOfTrans, setnumOfTrans] = useState([]);
    const [Bcoin, setBcoin] = useState([]);
    
    

    const jsdate =  async(date) =>{
        let e = new Date(Math.round((date-25569)*864e5));
       
        e =String(e).slice(4,15);
        date = e.split(" ");
        let day = date[1];
        if(day <=9){
            day =  day.toString().slice(1,2);
            
        }
        let month = date[0];
        month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month)/ 3 + 1 ;
        if(month.toString().length <=1){
            month =  month ;
        }
        let year = date[2];
        return (new Date(String(month + "/" + day + "/" + year.toString())).getTime());

    }

    const readexcel = (file) =>{
        const promise = new Promise((resolve, reject)=>{
            const filereader = new FileReader();
             filereader.readAsArrayBuffer(file);
            filereader.onload = (e)=>{
                const bufferarray = e.target.result;
                const wb = XLSX.read(bufferarray,{type:'buffer'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws)
               
                resolve(data);

            }
            filereader.onerror = (error) =>{
                console.error(error);
                reject(error);
            }
        });
        promise.then((d)=>{
           
            
            setData(d);
        })
    }
   
    
    //  Crypto_Amt: 75, Desc: 'USDT Deposited', Coin: 'USDT',  new Date(startDate.toLocaleDateString("en-US")).getTime()
    
    const map = async (data) =>{
        var hashmap = new Map();
        var hashMapNoTrans = new Map();
        if(data){
            for(let i= 0; i<data.length ; i++){
                
                let time =  await jsdate(data[i].Time);
              
                let pp =  startDate.toLocaleDateString("en-US").toString();
                let sp = new Date(pp).getTime();
                let pp1 =  endDate.toLocaleDateString("en-US").toString();
                let sp1 = new Date(pp1).getTime();
                // console.log(time + "    start    " + i + "  " + sp);
                // console.log(time + "    end     " + i + "  "+ sp1);
                if(time>= sp && time<=sp1){
                  //  console.log(i + "-->  "+ data[i].Coin);
                    if(hashmap.has(data[i].Coin)){
                        
                        let v = hashmap.get(data[i].Coin) + data[i].Crypto_Amt ;
                        let noOfTrans = hashMapNoTrans.get(data[i].Coin) + 1;
                        
                        
                        hashmap.set(data[i].Coin, v);
                        hashMapNoTrans.set(data[i].Coin, noOfTrans);
                       
                    }else{
                        
                        hashmap.set(data[i].Coin, data[i].Crypto_Amt);
                        hashMapNoTrans.set(data[i].Coin, 1);
                       // console.log(hashmap.get(data[i].Coin))
                        
                    }
                }else{
                    ;
                }
            }
            
            const t = [];
            const c = [];
          for(const x of hashmap.values()){
             t.push(x);
            
          }
          for(const x of hashmap.keys()){
            
           c.push(x);
         }
          setTransaction(t);
          setCoins(c);
        //  console.log(c);
        //  console.log(t);
         const nmt = [];
         const bc = [];
         for(const x of hashMapNoTrans.values()){
            nmt.push(x);
           
         }
         for(const x of hashMapNoTrans.keys()){
           
          bc.push(x);
        }
         setnumOfTrans(nmt);
         setBcoin(bc);
        }
    }
    useEffect(()=>{
        if(Data ){
            map(Data);
        }
      
     },[Data,startDate, endDate]);
    return (
        <div className="container">
            <div className="row c1">
                <div className="col-12 col-md-4 ">
                  <input type ="file" onChange={(e)=>{
                     const file = e.target.files[0];
                        readexcel(file)
                       
                    }} 
                  />
                </div>
                <div className="col-12 col-md-4 ">
                 <h3>Start Date</h3>
                <DatePicker style={{marginRight:"40px"}} className='date' selected={startDate} onChange={(date) => { 
                     setStartDate(date)
                      }}
                    />
                </div>
                <div className="col-12 col-md-4 ">
                    <h3>End Date</h3>
                <DatePicker className='date' selected={endDate} onChange={(date) =>{ 
                    setEndDate(date)
                    
                    } }/>
                </div>
            </div>
            <div className="row">
                  <div className="col-12 col-md-6 tra">
                      <h2> Total amount Transacted </h2>
                     <Chart type="pie"
                       className="chart"
                       width={500}
                       height={500}
                       color ="black"
                       series={transaction ? transaction : []}
                       options={{
                           labels:coins ? coins: []
                           
                       }}
                    />
                  </div>
                  <div className="col-12 col-md-6 tra">
                  <h2> Total Number of Transaction </h2>
                  <Chart type="pie"
                        width={500}
                        height={500}
                       series={numOfTrans ? numOfTrans : []}
                       options={{
                           labels: Bcoin ? Bcoin: []
                       }}
                    />
                  </div>
            </div>
        </div>
    );

}



export default App;
