import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip';
import Browse from '../Browse';
import { Link } from "react-router-dom";
import {FetchWithAuth} from '../util';

export default class RelationList extends React.Component<{definition:any, validation:any, beforeField:any, afterField:any, data:any, formdata:any, mode:string},{list:Array<any>}> {
  constructor(props: any) {
      super(props);
      this.state = {list: []};
  }

  //todo: maybe better visit data instead of form data?
  //todo: show name/picture of reference field(invoke another component mode)
  componentDidMount(){
    this.fetchRelatedContent();
  }

  fetchRelatedContent(){
    let identifier = this.props.definition.identifier;
    let data = this.props.formdata["relations"][identifier];
    if( !data ){
      return
    }

    let ids = [];
    let list = [];
    for( let item of data ){
      ids.push(item.from_content_id);
      list.push({id: item.from_content_id, name: item.from_content_id});
    }
    this.setState({list: list});
    // FetchWithAuth(process.env.REACT_APP_REMOTE_URL + '/content/list?cid='+ids.join(','))
    //     .then(res => res.json())
    //     .then((data) => {
    //         this.setState({list: data });
    //     })
  }

  confirmDialog(selected:Array<any>){
    this.setState({list:selected});
  }

  edit(){
    let def = this.props.definition;
    if( !def.parameters || !def.parameters.type ){
      console.error("No type defined in relationlist " + def.identifier);
      return <div className="alert alert-warning">Wrong setting on {def.name}</div>
    }
    let relatedType = def.parameters.type;
    let ids = [];
    for( let item of this.state.list ){
        ids.push(item.id);
    }
    //todo: make config from outside.
    return <div className={'edit field '+def.type}>
            {this.props.definition.name}:
            <Browse config={{"treetype":["folder"],"list":{"columns":["name"]}}} contenttype={relatedType} onConfirm={(selected:Array<any>)=>this.confirmDialog(selected)} selected={this.state.list} />
              {this.raw()}
              <input type="hidden" name={def.identifier} value={ids.join(',')} />
           </div>
  }

  view(){
    return <div>
            {this.props.definition.name}:
            {this.raw()}
           </div>
  }

  raw(){
    return (this.state.list.length>0&&
      <ul>
      {this.state.list.map((item:any)=>{
          return <li>
          <Link target="_blank" to={'/main/'+item.id}>{item.name}</Link></li>
      })}
   </ul>)
  }

  render(){
    if(this.props.mode=='edit'){
      return this.edit();
    }else if(this.props.mode=='view'){
      return this.view();
    }else{
      return this.raw();
    }
  }
}
