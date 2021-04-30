const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo('localhost:40000', grpc.credentials.createInsecure());

client.createTodo({
    id: -1,
    text: "Test gRPC"
}, (error, response) =>{
    console.log(`Received from server`, JSON.stringify(response));
});

client.readTodos({}, (error, response) => {
    console.log(`Received all from server`, JSON.stringify(response));
    if(response.items) {
        response.items.forEach(element => {
            console.log(`Item Data`, element)
        });
    }
})

const call = client.readTodosStream();
call.on('data', item => {
    console.log(`Received item stream`, JSON.stringify(item))
})
call.on('end', e => {
    console.log(`Server done`)
})