export function getEventTypes(theABI, aName) {

    const event = theABI.find(item => item.type === 'event' && item.name === aName);
    if (!event) {
      console.log("No event found for event");
      throw new Error(`Event ${aName} not found in contract ABI`);
    }
    const eventTypes = event.inputs.map(input => input.type);
    return eventTypes;
  }

  export function getEventArgNames(theABI, aName) {

    const event = theABI.find(item => item.type === 'event' && item.name === aName);
    if (!event) {
      console.log("No event found for event");
      throw new Error(`Event ${aName} not found in contract ABI`);
    }
    const eventArgNames = event.inputs.map(input => input.name);
    return eventArgNames;
  }

  export function transformEventsIntoDictionaryArray(theABI, eventName, events){
    const argNames = getEventArgNames(theABI, eventName);
    const eventsAsDictionaries = events.map(event => {
        const obj = argNames.reduce((acc, key, index) => {
            acc[key] = event.args[index];
            return acc;
          }, {});
        const  objWithBlockNumber = { ...obj, blockNumber:event.blockNumber}
        return objWithBlockNumber;
    })
    return eventsAsDictionaries
  }

  export function transformOneEventIntoADictionary(theABI, eventName, event){
    const argNames = getEventArgNames(theABI, eventName);
        const obj = argNames.reduce((acc, key, index) => {
            acc[key] = event.args[index];
            return acc;
          }, {});
        return obj;
  }