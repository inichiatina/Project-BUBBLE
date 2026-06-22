# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # para o react comunicarcom o backend importa middleware
from pyntrest import PinterestClient # biblioteca que faz scrapping do pinterest

app = FastAPI()
client = PinterestClient() #cria um cliente e vai ser usado para pesquisar

# Middleware CORS para permitir React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permite pedidos de qualquer origem
    allow_credentials=True, # permite autenticação
    allow_methods=["*"], # permite métodos(get,)
    allow_headers=["*"],
)

@app.get("/api/pinterest/busca/{termo_busca}")
def buscar_imagens_dinamica(termo_busca: str):
    print(f"Buscando termo: {termo_busca}")  # debug
    try:
        images = client.get_image_links(termo_busca, num_images=5) # posso definir quantas imagens quero que retorne
        print(f"Resultado: {images}")  # debug
        return {"resultado": images}
    except Exception as e:
        print(f"Erro ao buscar imagens: {e}")
        return {"resultado": [], "erro": str(e)}



