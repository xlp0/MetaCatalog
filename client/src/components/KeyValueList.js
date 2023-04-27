const KeyValueList = ({ dict }) => {
    return (
      <div className="Dictionary">
        {dict !== null ? Object.keys(dict).map((key) => (
          <tr className="Dictionary" key={key}>
              <td className="theKey" >{key}</td>
              <td className="theValue">{dict[key]}</td>
          </tr>
        )): "No content"}
      </div>
    );
  };
  
  export default KeyValueList;
  