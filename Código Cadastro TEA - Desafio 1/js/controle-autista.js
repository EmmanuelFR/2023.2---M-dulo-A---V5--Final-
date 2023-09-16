const URL = 'http://localhost:3400/autistas';
let modoEdicao = false;

let listaAutistas = [];

let btnAdicionar = document.getElementById('btn-adicionar');
let tabelaAutista = document.querySelector('table>tbody');
let modalAutista = new bootstrap.Modal(document.getElementById("modal-autista"), {});
let tituloModal = document.querySelector('h4.modal-title');

let btnSalvar = document.getElementById('btn-salvar');
let btnCancelar = document.getElementById('btn-cancelar');

let formModal = {
    id: document.getElementById('id'),
    nome: document.getElementById('nome'),
    genero: document.getElementById('genero'),
    idade: document.getElementById('idade'),
    responsavel: document.getElementById('responsavel'),
    contato: document.getElementById('contato'),
    cid: document.getElementById('cid'),
    nivel: document.getElementById('nivel'),
    dataCadastro: document.getElementById('dataCadastro')
}

btnAdicionar.addEventListener('click', () =>{
    modoEdicao = false;
    tituloModal.textContent = "Adicionar registro"
    limparModalAutista();
    modalAutista.show();
});

btnSalvar.addEventListener('click', () => {
    let autista = obterAutistaDoModal();
    if (!autista.nome || !autista.genero || !autista.idade || !autista.responsavel || !autista.contato || !autista.cid || !autista.nivel){
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'As informações obrigatórias não foram preenchidas.',
            showConfirmButton: true,
        });
        return;
    }

    (modoEdicao) ? atualizarAutistaBackEnd(autista) : adicionarAutistaBackEnd(autista);

});

btnCancelar.addEventListener('click', () => {
    modalAutista.hide();
});

function obterAutistaDoModal(){

    return new Autista({
        id: formModal.id.value,
        nome: formModal.nome.value,
        genero: formModal.genero.value,
        idade: formModal.idade.value,
        responsavel: formModal.responsavel.value,
        contato: formModal.contato.value,
        cid: formModal.cid.value,
        nivel: formModal.nivel.value,
        dataCadastro: formModal.dataCadastro.value
    });
}
 
function obterAutistas() {

    fetch(URL, {
        method: 'GET',
        headers :{
            'Authorization': obterToken()
        }
    })
        .then(response => response.json())
        .then(autistas => {
            listaAutistas = autistas;
            popularTabela(autistas);
        })
        .catch()
}

function editarAutista(id){
    modoEdicao = true;
    tituloModal.textContent = "Editar registro"

    let autista = listaAutistas.find(autista => autista.id == id);
    
    atualizarModalAutista(autista);

    modalAutista.show();
}

function atualizarModalAutista(autista){

    formModal.id.value = autista.id;
    formModal.nome.value = autista.nome;
    formModal.genero.value = autista.genero;
    formModal.idade.value = autista.idade;
    formModal.responsavel.value = autista.responsavel;
    formModal.contato.value = autista.contato;
    formModal.cid.value = autista.cid;
    formModal.nivel.value = autista.nivel;
    formModal.dataCadastro.value = autista.dataCadastro.substring(0,10);
}

function limparModalAutista(){

    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.genero.value = "";
    formModal.idade.value = "";
    formModal.responsavel.value = "";
    formModal.contato.value = "";
    formModal.cid.value = "";
    formModal.nivel.value = "";
    formModal.dataCadastro.value = "";
}

function excluirAutista(id){

    let autista = listaAutistas.find(c => c.id == id);
    Swal.fire({
        title: "Deseja realmente excluir o registro de " + autista.nome + "?",
        text: "Esta ação não poderá ser desfeita.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0066ff',
        cancelButtonColor: '#afafaf',
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        
        if (result.isConfirmed) {
            excluirAutistaBackEnd(autista);
        }
    }) 
}

function criarLinhaNaTabela(autista) {
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdGenero = document.createElement('td');
    let tdIdade = document.createElement('td');
    let tdResponsavel = document.createElement('td');
    let tdContato = document.createElement('td');
    let tdCID = document.createElement('td');
    let tdnivel = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    tdId.textContent = autista.id;
    tdNome.textContent = autista.nome;
    tdGenero.textContent = autista.genero;
    tdIdade.textContent = autista.idade;
    tdResponsavel.textContent = autista.responsavel;
    tdContato.textContent = autista.contato;
    tdCID.textContent = autista.cid;
    tdnivel.textContent = autista.nivel;
    tdDataCadastro.textContent = new Date(autista.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML = `<button onclick="editarAutista(${autista.id})" class="btn btn-outline-primary btn-sm mr-3 icone-editar">
                             <img class='editar' src='images/marker-solid.svg'>
                         </button>
                         <button onclick="excluirAutista(${autista.id})" class="btn btn-outline-primary btn-sm mr-3 icone-excluir">
                         <img class='excluir' src='images/trash-can-solid.svg'>
                         </button>`;

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdGenero);
    tr.appendChild(tdIdade);
    tr.appendChild(tdResponsavel);
    tr.appendChild(tdContato);
    tr.appendChild(tdCID);
    tr.appendChild(tdnivel);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    tabelaAutista.appendChild(tr);
}

function popularTabela(autistas) {
    tabelaAutista.textContent = "";

    autistas.forEach(autista => {
        criarLinhaNaTabela(autista);
    });
}

function adicionarAutistaBackEnd(autista){

    autista.dataCadastro = new Date().toISOString();

    fetch(URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body: JSON.stringify(autista)
    })
    .then(response => response.json())
    .then(response => {

        let novoAutista = new Autista(response);
        listaAutistas.push(novoAutista);

        popularTabela(listaAutistas)

        modalAutista.hide();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro cadastrado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}


function atualizarAutistaBackEnd(autista){

    fetch(`${URL}/${autista.id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        },
        body : JSON.stringify(autista)
    })
    .then(response => response.json())
    .then(() => {
        atualizarAutistaNaLista(autista, false);
        modalAutista.hide();

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro atualizado com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}

function excluirAutistaBackEnd(autista){

    fetch(`${URL}/${autista.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': obterToken()
        }
    })
    .then(response => response.json())
    .then(() => {
        atualizarAutistaNaLista(autista, true);
        modalAutista.hide();
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro excluido com sucesso!',
            showConfirmButton: false,
            timer: 2500
        });
    })
    .catch(error => {
        console.log(error)
    })
}

function atualizarAutistaNaLista(autista, removerAutista){

    let indice = listaAutistas.findIndex((c) => c.id == autista.id);

    (removerAutista) 
        ? listaAutistas.splice(indice, 1)
        : listaAutistas.splice(indice, 1, autista);

    popularTabela(listaAutistas);
}

obterAutistas();