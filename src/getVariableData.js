const variableDataLoader = new function(dataName) {
    this.getVariableDataList = async (dataName) => $.get('/a/variable/data/'+dataName);
};