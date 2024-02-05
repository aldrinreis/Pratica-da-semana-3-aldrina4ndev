const express = require('express');
const formidable = require('formidable');
const fs = require('fs');

const app = express();

// Rota para enviar arquivos
app.post('/enviodearquivo', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (erro, campos, arquivos) => {
    const urlAntiga = arquivos.filetoupload[0].filepath;
    const urlNova = "./enviodearquivo/" + arquivos.filetoupload[0].originalFilename;
    var rawData = fs.readFileSync(urlAntiga);
    fs.writeFile(urlNova, rawData, function(err) {
      if (err) {
        console.log(err);
        res.status(500).send("Erro ao mover o arquivo");
      } else {
        res.status(200).send("Arquivo enviado com sucesso!");
      }
    });
  });
});

// Rota para listar os arquivos
app.get('/listar', (req, res) => {
  listarArquivos('./enviodearquivo');
  res.status(200).send("Listagem de arquivos realizada com sucesso!");
});

// Rota padrão para servir o HTML
app.get('/', (req, res) => {
  const filePath = "index.html";
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).send("Erro interno do servidor");
    } else {
      res.status(200).send(data);
    }
  });
});

// Função para listar os arquivos
function listarArquivos(diretorio, arquivos) {
  if (!arquivos) arquivos = [];
  let listagemArquivos = fs.readdirSync(diretorio);
  console.log(listagemArquivos);
}

const porta = 3000;
app.listen(porta, () => {
  console.log("Servidor rodando na porta " + porta);
});
