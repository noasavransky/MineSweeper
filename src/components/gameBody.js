import React from 'react';
import base from '../images/base.png';
import flag from '../images/flag.png';
import pic0 from '../images/0.png';
import pic1 from '../images/1.png';
import pic2 from '../images/2.png';
import pic3 from '../images/3.png';
import pic4 from '../images/4.png';
import pic5 from '../images/5.png';
import pic6 from '../images/6.png';
import pic7 from '../images/7.png';
import pic8 from '../images/8.png';
import mine from '../images/mine.png';
import genie from '../images/genie.png';
import '../App.css';
import { Col, Row, Grid } from 'react-flexbox-grid'
import GameHeder from './gameHeader.js'

class GameBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            height: 10, 
            width: 10, 
            mines: 10, 
            flags: {good: 0, bad: 0}, 
            gameStatus:"pre",
            showAll:false,
            alert: "",
            dataTable: []};

        this.newGame = this.newGame.bind(this);
        this.updateGameSettings = this.updateGameSettings.bind(this);
        this.createDataTable = this.createDataTable.bind(this);
        this.setMines = this.setMines.bind(this);
        this.applyAround = this.applyAround.bind(this);
        this.increaseValue = this.increaseValue.bind(this);
        this.onClick = this.onClick.bind(this);
        this.fixFlags = this.fixFlags.bind(this);
        this.formatBoxesTable = this.formatBoxesTable.bind(this);
        this.reveal = this.reveal.bind(this);
        this.revealAll = this.revealAll.bind(this);
        this.superman = this.superman.bind(this);   
        this.handleSuperman = this.handleSuperman.bind(this);
    }

    newGame() {
        this.dataTable = this.createDataTable()
        this.setMines();
        this.setState({dataTable: this.dataTable, gameStatus:"ongoing", showAll:false});                    
    }
    
    updateGameSettings(newGameData) {
        newGameData.gameStatus = "pre";
        newGameData.flags = {good: 0, bad: 0};
        this.setState(newGameData, this.newGame);        
    } 

    createDataTable() {
        let dataTable = Array.from({length: this.state.width}, 
                                    () => Array.from({length: this.state.height}, () => ({value: 0, isMine: false, revealed:false, flagged:false})))

        return dataTable;
    }

    setMines() {
        for(let mineCount = 0; mineCount < this.state.mines; mineCount++) {
            let x = Math.floor(Math.random() * (this.state.width));
            let y = Math.floor(Math.random() * (this.state.height));
            
            if(!this.dataTable[x][y].isMine)            
            {
                this.dataTable[x][y].isMine = true;                
                this.applyAround({x,y},this.increaseValue)
            }
            else
            {
                mineCount--
            }
        }
    }

    formatBoxesTable() {
        if (this.state.gameStatus === "pre") {
            return;
        }

        let rows = [];
        for (let height = 0; height < this.state.height; height++) {
            let cells = [];
            for (let width = 0; width < this.state.width; width++) {

                let elem = <Col key={width.toString() + "," + height.toString()}>
                                <MineBox id={width.toString() + "," + height.toString()} 
                                        click={this.onClick} 
                                        isMine={this.state.dataTable[width][height].isMine} 
                                        value={this.state.dataTable[width][height].value}
                                        revealed={this.state.dataTable[width][height].revealed}
                                        flagged={this.state.dataTable[width][height].flagged}
                                        showAll={this.state.showAll}>
                                </MineBox>
                            </Col> ;
                cells.push(elem);
            }
            let newRow = React.createElement(
                Row,
                {className: "Mine-row"},
                cells
            );
            rows.push(newRow);
        }

        let newTable = React.createElement(
            Grid,
            {className: "Mine-grid"},
            rows
        );

        return newTable;
    }

    applyAround(point,toApplyFunc)
    {           
        let height = this.state.height;
        let width = this.state.width;
        function checkAndApply(point){
            if(point.x >= 0 && point.y >= 0 && point.x < width && point.y < height) {
                toApplyFunc(point)
            }
        }

        let {x,y} = point;
        
        // left side          
        checkAndApply({x: x - 1, y});// <-
        checkAndApply({x: x - 1, y: y - 1});//<-^
        checkAndApply({x: x - 1, y: y + 1})//<-v
          
        // right side
        checkAndApply({x: x + 1, y});// ->
        checkAndApply({x: x + 1, y: y -1});// ->^
        checkAndApply({x: x + 1, y: y + 1})// -> v
          
        // up and down
        checkAndApply({x, y: y - 1});// ^
        checkAndApply({x, y: y + 1})// V
    }

    increaseValue (point) {
        this.dataTable[point.x][point.y].value++;
    }

    onClick (shift, box) {
        let id = this.convertId(box.id)
        if (shift) {
            this.fixFlags(id)
        }
        else {
            if (box.isMine)
            {
                this.gameOver()
            }            

            this.reveal(id)
        }
    }

    fixFlags(id){
        
        let {x,y} = id;
        let currBox = this.state.dataTable[x][y];

        if (this.state.flags.bad + this.state.flags.good == this.state.mines && !currBox.flagged) {
            let alert = <h4>Your out of Flags!</h4>;
            this.setState({alert});
            return;
        }

        var goodOrBad = currBox.isMine ? "good" : "bad";
        var change = currBox.flagged ? -1 : 1;
                
        let {flags} = this.state;
        flags[goodOrBad] += change;

        let tempGrid = this.state.dataTable;
        tempGrid[x][y].flagged = !tempGrid[x][y].flagged;

        this.setState({flags, dataTable: tempGrid ,alert: ""}, ()=>{
            if (this.state.flags.good == this.state.mines) {
                this.setState({gameStatus:"win"});
                this.revealAll(true);
            }
        });
        
    }

    reveal(id){
        let {x,y} = id;
        
        let tempGrid = this.state.dataTable;
        
        if (!tempGrid[x][y].flagged && !tempGrid[x][y].revealed) {
            tempGrid[x][y].revealed = true;
            this.setState({dataTable: tempGrid});

            if (tempGrid[x][y].value == 0) {
                this.applyAround(id, this.reveal)
            }
        }
    }

    convertId(id) { 
        if (typeof id == "string") {
            let [x,y]= id.split(",");
            x = x * 1;
            y = y * 1;
            return {x,y};
        }
        return id;
    };

    gameOver(){
        this.revealAll(true);
        this.setState({gameStatus:"lose"});
    }

    revealAll(toReveal){        
        this.setState({showAll: toReveal});
    }

    handleSuperman(){
        this.state.showAll? this.revealAll(false): this.revealAll(true);
    }

    superman(){
        if (this.state.gameStatus !== "ongoing") return;

        let superman = <div>
            <h4>Do you wish to see the answer? <img src={genie} 
                                                    className={"Genie-pic"} 
                                                    alt="see the truth!" 
                                                    onClick={this.handleSuperman}/></h4>
        </div>

        return superman;
    }

    render() {        
        return (
        <div>
            <GameHeder height={this.state.height} 
                       width={this.state.width} 
                       mines={this.state.mines}
                       flags={this.state.flags}
                       update={this.updateGameSettings}
                       status={this.state.gameStatus}></GameHeder>
            {this.state.alert}
            {this.formatBoxesTable()}
            {this.superman()}
        </div>
        );
    };
}

class MineBox extends React.Component {

    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
        this.picMap = {
            0: pic0,
            1: pic1,
            2: pic2,
            3: pic3,
            4: pic4,
            5: pic5,
            6: pic6,
            7: pic7,
            8: pic8
        };
    }

    handleClick (e) {
        const isShift = e.shiftKey;        

        const boxData = {id: this.props.id}

        this.props.click(isShift, boxData);
    }

    render() {
      return (        
          <img  src={(this.props.showAll || this.props.revealed)? (this.props.isMine? mine : this.picMap[this.props.value]) : (this.props.flagged? flag: base)} 
                className={"Box-logo "} 
                alt={this.props.value} 
                onClick={this.handleClick}/>        
      );
    }
}
export default GameBody;
