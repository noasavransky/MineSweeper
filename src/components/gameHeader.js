import React from 'react';
import '../App.css';
import win from '../images/win.png';
import lose from '../images/lose.png';
import go from '../images/go.png';
import mines from '../images/bomb.png';
import width from '../images/width.png';
import height from '../images/height.png';
import flags from '../images/flags.png';


class GameHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {width: 10, height: 10, mines: 10}
        this.GameStatus = this.GameStatus.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    GameStatus () {
        let elem;
        var picMap ={win, lose, width, height, mines }

        if (this.props.status === "pre") {
            return (<div>
                <h1>
                    Mine Sweeper <img src={mines} className={"Head-pic"}/>
                </h1>                
                {this.StartNewGame()}
            </div>);            
        }

        if (this.props.status === "win" || this.props.status === "lose") {
            elem = <div>
                <h2>You {this.props.status.toUpperCase()}! 
                <img src={picMap[this.props.status]} className={"Win-pic"} alt={this.props.status}/></h2>
                {this.StartNewGame()}
            </div>;
        }
        else {
            let flagsCount = this.props.mines - (this.props.flags.good + this.props.flags.bad);
            elem = <div>
                <h1>
                    {["Height", "Width", "Mines"].map(curr => {return <span className="Header-title">
                        <img src={picMap[curr.toLowerCase()]} className={"Header-pic"} alt={curr}/> {curr} {this.props[curr.toLowerCase()]}
                    </span>})}
                    <br></br>
                    <span className="Header-title">
                        <img src={flags} className={"Header-pic"} alt="flags"/> Remaining Flags {flagsCount}
                    </span>
                </h1>
                </div>;
        }
        return elem;
    }

    StartNewGame () {
        return (<div>
            <h3>Do you want to start a new game?</h3>
            <span className="Header-title">Board Width: <input  type="number" 
                                                                value={this.state.width}
                                                                name="width"
                                                                min="0"
                                                                max="300"
                                                                onChange={this.handleChange}
                                                                className="Game-input"></input> 
            </span>
            <span className="Header-title">Board Height: <input type="number" 
                                                                value={this.state.height}
                                                                name="height" 
                                                                min="0"
                                                                max="300"
                                                                onChange={this.handleChange}
                                                                className="Game-input"></input> 
            </span>
            <span className="Header-title">Mines: <input    type="number" 
                                                            value={this.state.mines}
                                                            name="mines"
                                                            min="0"
                                                            max={this.state.width * this.state.height}
                                                            onChange={this.handleChange}
                                                            className="Game-input"></input> 
            </span>
            <div onClick={this.handleStart}>
                <h2>
                    Start Game <img src={go} className={"Start-pic"} alt="start game!"/>
                </h2>
            </div>
        </div>);  
    }

    handleStart(event) {
        const newData = {
            height: this.state.height,
            width: this.state.width,
            mines: this.state.mines,
        }
        this.props.update(newData);
    }

    handleChange (event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (value < 0) value = 0;

        if (name === "width" || name === "height") {
            value = Math.min(value, 300);
        }
        
        if (name === "mines") {
            value = Math.min(value ,this.state.height * this.state.width);
        }

        this.setState({[name]:value});
    }

    render() {
      return this.GameStatus();
    }
  }

export default GameHeader;
