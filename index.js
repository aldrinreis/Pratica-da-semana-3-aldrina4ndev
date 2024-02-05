const http = require("http");
const formidavel = require("formidable");
const fs = require("fs");
const url = require("url");
const porta = 443;

const servidor = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === "/enviodearquivo") {
    const form = new formidavel.IncomingForm();
    form.parse(req, (erro, campos, arquivos) => {
      const urlAntiga = arquivos.filetoupload[0].filepath;
      const urlNova =
        "./enviodearquivo/" + arquivos.filetoupload[0].originalFilename;
      var rawData = fs.readFileSync(urlAntiga);
      fs.writeFile(urlNova, rawData, function(err) {
        if (err) {
          console.log(err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Erro ao mover o arquivo");
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("Arquivo enviado com sucesso!");
        }
      });
    });
  } else if (reqUrl.pathname === "/listar") {
    listarArquivos('./enviodearquivo');
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Listagem de arquivos realizada com sucesso!");
  } else {
    const filePath = "index.html";
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Erro interno do servidor");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
});

function listarArquivos(diretorio, arquivos) {
  if (!arquivos) arquivos = [];
  let listagemArquivos = fs.readdirSync(diretorio);
  console.log(listagemArquivos);
}


servidor.listen(porta, () => {
  console.log("Servidor rodando na porta " + porta);
});
