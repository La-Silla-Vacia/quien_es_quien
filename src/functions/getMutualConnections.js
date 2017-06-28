function findMutualConnections(ids, newProps) {
  const props = (newProps) ? newProps : this.props;
  const { peopleLookup, connectionsLookup } = props;
  const personsConnections = [];

  const allConnIds = [];
  for (let id of ids) {
    const connections = (connectionsLookup[id]) ? connectionsLookup[id] : [];
    const pConnections = [];
    for (let rawConnection of connections) {
      const { target, source } = rawConnection;
      const connection = (peopleLookup[target].id === id) ? peopleLookup[source] : peopleLookup[target];

      if (allConnIds.indexOf(connection.id) === -1) {
        allConnIds.push(connection.id);
      }
      pConnections.push(connection);
    }
    pConnections.push(peopleLookup[id]);
    personsConnections.push(pConnections);
  }

  const toBeRemoved = [];
  let removed = 0, count = 0;
  for (let i = 0; i < personsConnections.length; i++) {
    const personConnections = personsConnections[i];
    removed = 0;
    count = 0;
    const personLoopConnections = personConnections.map((item) => {
      return item.id
    });

    for (let j = 0; j < allConnIds.length; j++) {
      const connection = allConnIds[j];
      count++;
      const inConnections = (personLoopConnections.indexOf(connection) !== -1);
      if (!inConnections) {
        toBeRemoved.push(connection);
      }
    }
  }

  for (let id of toBeRemoved) {
    for (let i = allConnIds.length; i--;) {
      if (allConnIds[i] === id) allConnIds.splice(i, 1);
    }
  }

  return allConnIds.map((connection) => {
    return peopleLookup[connection];
  });
}
export default findMutualConnections;