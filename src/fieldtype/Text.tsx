import * as React from 'react';
import Moment from 'react-moment';
import ReactTooltip from 'react-tooltip'


//Supported mode: view, edit, inline(no definition needed).
export default class Text extends React.Component<{definition:any, validation:any, data:any, mode:string},{}> {

constructor(props:any) {
      super(props);
      this.state = {};
    }

    raw(){
      return this.props.data;
    }

    view(){
      return <>
              <label className="field-label">{this.props.definition.name}: </label>
              <div className={"field-value"+(this.props.definition.parameters&&this.props.definition.parameters.multiline?' fieldtype-text-multiline':'')}>{this.props.data}</div>
              </>
    }

    edit(){
      const def = this.props.definition;
      const name = def.identifier;
      return (<>
              <label className="field-label" htmlFor={this.props.definition.identifier}>{this.props.definition.name}
                  {this.props.definition.description&&<i className="icon-info" data-for={this.props.definition.identifier+'-desciption'} data-tip=""></i>}
                  {this.props.definition.description&&<ReactTooltip id={this.props.definition.identifier+'-desciption'} effect="solid" place="right" html={true} clickable={true} multiline={true} delayHide={500} className="tip">{this.props.definition.description}</ReactTooltip>}
              :</label>
              {(def.parameters&&def.parameters.multiline)?
                <textarea id={name} className="field-value form-control" name={name} defaultValue={this.props.data} />
                :<input type="text" id={name} className="field-value form-control" name={name} defaultValue={this.props.data} />
              }
              </>
      )
    }

    render(){
      if(this.props.mode=='view'){
          return this.view();
      }else if(this.props.mode=='edit'){
          return this.edit();
      }else{
        return this.raw();
      }
    }
}
