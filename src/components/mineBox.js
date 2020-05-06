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
import '../App.css';

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

        const boxData = {id: this.props.id, isMine:this.props.isMine}

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
export default MineBox;