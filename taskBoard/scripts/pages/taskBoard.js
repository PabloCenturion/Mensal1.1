let columnCounter = 0;
let boardSelect = 0;

async function loadData(){
    try {
        const response = await fetch("https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards");
        const data = await response.json();
        console.log(data)
        selectBoard(data);
    }catch(erro){
        console.error("Erro ao carregar dados");
    }
}

function selectBoard(data){
    const inputDados = document.querySelector(".dropdown-menu");
    data.forEach(data => {
        let linha = `<li><a class="dropdown-item" id="${data.Id}" href="#">${data.Name}</a></li>`
        inputDados.innerHTML += linha;
        boardSelect = data.Id;
    });
    inputDados.addEventListener("click", (event) => {
        if (event.target.classList.contains("dropdown-item")) {
            console.log(`Item clicado: ${event.target.textContent}`);
            const boardId = event.target.getAttribute("Id");
            console.log(boardId);
            loadColumn(boardId);
        }
    })
}

async function loadColumn(boardId) {
    let response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId=${boardId}`)
    let dataColumns = await response.json();
    console.log(dataColumns);

    dataColumns.forEach( column => {
        const coluna = document.createElement("div");
        coluna.classList.add("Board"); // Adiciona classe principal para estilo
        coluna.id = column.Id

        const titleContainer = document.createElement("div");
        titleContainer.style.display = "flex"; // Ativa o Flexbox
        titleContainer.style.alignItems = "center"; // Alinha verticalmente ao centro
        titleContainer.style.justifyContent = "space-between"; // Espaço apropriado entre itens
        titleContainer.style.marginBottom = "8px";
        
        const nome = document.createElement("div");
        nome.classList.add("title"); // Adiciona classe 'title' para estilização
        nome.textContent = column.Name;
        nome.style.fontSize = "18px";
        nome.style.fontWeight = "bold";
        nome.style.marginBottom = "8px";

        const changeTitle = document.createElement("button");
        changeTitle.classList.add("changeTitle");
        changeTitle.innerHTML = '<i class="bi bi-pen"></i>';
        changeTitle.style.background = "none";
        changeTitle.style.border = "none";
        changeTitle.style.cursor = "pointer";
        changeTitle.style.marginLeft = "8px";
        changeTitle.style.color = "#0079bf";
        changeTitle.addEventListener("click", () => {
            const novoTitulo = prompt("Digite o novo título:", changeTitle.textContent);
            if (novoTitulo && novoTitulo.trim()) {
                nome.textContent = novoTitulo.trim();
            }
        });

        const contentTask = document.createElement("div");
        contentTask.classList.add("contentTask");

        const addTaskBtn = document.createElement("button");
        addTaskBtn.classList.add("btn", "btn-primary");
        addTaskBtn.textContent = "Adicionar Task +";
        addTaskBtn.style.marginTop = "12px";

        addTaskBtn.addEventListener("click", () => {
            const novaTarefa = prompt("Digite a nova tarefa:");
            if (novaTarefa && novaTarefa.trim()) {
                const task = document.createElement("div");
                task.textContent = novaTarefa.trim();
                task.style.marginBottom = "8px";
                task.style.padding = "8px";
                task.style.backgroundColor = "#f4f5f7";
                task.style.borderRadius = "4px";
                task.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)";
                contentTask.appendChild(task);
            }
        });

        titleContainer.appendChild(nome);
        titleContainer.appendChild(changeTitle);
        coluna.appendChild(titleContainer);
        coluna.appendChild(addTaskBtn);
        coluna.appendChild(contentTask);
        const container = document.querySelector(".container");

        container.appendChild(coluna);
    })
    console.log(dataColumns);
    dataColumns.forEach(column =>{
        getTaskByColumnId(column.Id).then((arrayTask) =>{
            console.log(arrayTask);
            showTasks(column.Id,arrayTask);
        });
    })
    
}

async function getTaskByColumnId(columnId) {
    let response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId=${columnId}`);
    let arrayTask =  await response.json();
    return arrayTask;
}

function showTasks(columnId,arrayTask){
    const columnDiv = document.getElementById(`${columnId}`)
    arrayTask.forEach((task)=>{
        const div =  document.createElement("div");
        div.textContent = task.Title;

        columnDiv.appendChild(div);
        console.log(div);
    })
}

function trocarTitle(){
        const title = document.querySelector(".title");

        const input = document.createElement("input");
        input.type = "text";

        const button = document.createElement("button");
        button.textContent = "Salvar"

        button.addEventListener("click", (e)=>{
            const newTitle = input.value
            if(newTitle.trim()){
                title.textContent = newTitle;
            }
        })
        title.appendChild(input);
        title.appendChild(button);
}

function addTask() {
    const taskContainer = document.querySelector(".contentTask");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Digite a nova tarefa";
    input.style.marginRight = "8px"; // Espaçamento entre o input e o botão

    // Criar botão para salvar a nova tarefa
    const button = document.createElement("button");
    button.textContent = "Salvar";

    // Adicionar evento ao botão
    button.addEventListener("click", () => {
        const newTask = input.value.trim(); // Captura o texto e remove espaços desnecessários
        if (newTask) {
            // Criar elemento para exibir a nova tarefa
            const taskItem = document.createElement("div");
            taskItem.textContent = newTask;
            taskItem.className = "task-item";
            taskItem.style.marginBottom = "8px"; // Espaçamento entre tarefas
            taskItem.style.padding = "8px";
            taskItem.style.border = "1px solid #ccc";
            taskItem.style.borderRadius = "4px";
            taskItem.style.backgroundColor = "#f9f9f9";

            // Adicionar a nova tarefa ao container de tarefas
            taskContainer.appendChild(taskItem);

            // Limpar o input após adicionar a tarefa
            input.remove();
            button.remove();
        }
    });

    // Limpar o conteúdo da div `.input` e adicionar o campo de entrada e botão
    const inputContainer = document.querySelector(".input");
    inputContainer.innerHTML = ""; // Limpar o conteúdo para evitar duplicação
    inputContainer.appendChild(input);
    inputContainer.appendChild(button);
    //input.remove();
}

function createColumn() {
    const divColuna = document.createElement("div");
    divColuna.classList.add("Board");
    divColuna.style.margin = "16px";
    divColuna.style.padding = "16px";
    divColuna.style.backgroundColor = "#ffffff";
    divColuna.style.borderRadius = "8px";
    divColuna.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

    const input = document.createElement("input");
    input.classList.add("form-control");
    input.type = "text";
    input.placeholder = "Digite o título da coluna";
    input.style.marginBottom = "8px";

    const button = document.createElement("button");
    button.textContent = "Confirmar";
    button.type = "button";
    button.style.backgroundColor = "#0079bf";
    button.style.color = "#ffffff";
    button.style.border = "none";
    button.style.padding = "8px 16px";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";

    divColuna.appendChild(input);
    divColuna.appendChild(button);

    const container = document.querySelector(".container");
    container.appendChild(divColuna);

    button.addEventListener("click", () => {
        const valor = input.value.trim();
        if (valor) {
            divColuna.remove();

            const contentBoard = document.createElement("div");
            contentBoard.classList.add("Board");

            const columnId = `column-${columnCounter++}`;
            contentBoard.setAttribute("id", columnId);

            const contentBoardInner = document.createElement("div");
            contentBoardInner.classList.add("ContentBoard");

            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = valor;

            const changeTitle = document.createElement("button");
            changeTitle.classList.add("changeTitle");
            changeTitle.innerHTML = '<i class="bi bi-pen"></i>';

            changeTitle.addEventListener("click", () => {
                const novoTitulo = prompt("Digite o novo título:", title.textContent);
                if (novoTitulo && novoTitulo.trim()) {
                    title.textContent = novoTitulo.trim();
                }
            });

            const contentTask = document.createElement("div");
            contentTask.classList.add("contentTask");

            const inputTask = document.createElement("div");
            inputTask.classList.add("input");

            const addTaskBtn = document.createElement("button");
            addTaskBtn.classList.add("btn", "btn-primary");
            addTaskBtn.textContent = "Adicionar Task +";

            addTaskBtn.addEventListener("click", () => {
                const novaTarefa = prompt("Digite a nova tarefa:");
                if (novaTarefa && novaTarefa.trim()) {
                    const task = document.createElement("div");
                    task.textContent = novaTarefa.trim();
                    task.style.marginBottom = "8px";
                    task.style.padding = "8px";
                    task.style.backgroundColor = "#f4f5f7";
                    task.style.borderRadius = "4px";
                    task.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)";
                    contentTask.appendChild(task);
                }
            });

            const divColumn = document.createElement("div");
            divColumn.classList.add("column");

            // Montar a estrutura da coluna
            contentBoardInner.appendChild(title);
            contentBoardInner.appendChild(changeTitle);
            contentBoard.appendChild(contentBoardInner);
            contentBoard.appendChild(contentTask);
            contentBoard.appendChild(inputTask);
            divColumn.appendChild(addTaskBtn);
            contentBoard.appendChild(divColumn);

            // Adicionar a coluna no container
            container.appendChild(contentBoard);
        } else {
            alert("Insira um título válido");
        }
    });
    //console.log(`Coluna criada com ID: ${columnId}`);
    postColumn(boardSelect,input.value);
}

async function postColumn(boardId,name) {

    try{

        const endpoint = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column";
    const columnData = {
        BoardId: boardId,
        Name: name,
    };
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(columnData),
    })

    const idColumn = await response.json()

    console.log(`Id da coluna nova: ${idColumn}`)

    }catch(erro){

        throw `Erro ao Postar Coluna ${erro}`
    }
    
    
}

