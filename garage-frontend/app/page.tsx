'use client'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const [carros, setCarros] = useState([])
  
  // Estados para o formulário
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState('')
  const [preco, setPreco] = useState('')
  const [idEditando, setIdEditando] = useState<number | null>(null)
  const [busca, setBusca] = useState('')
  const [codigoFipe, setCodigoFipe] = useState('')

  //FUNÇÃO DE FORMATAÇÃO DE MOEDA
  const formatarMoeda = (valor: any) => {
    if (!valor) return 'R$ 0,00';
    
    // Converte o valor para número (remove pontos de milhar e troca vírgula por ponto)
    const numerico = typeof valor === 'string' 
      ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) 
      : valor;
    
    // Retorna formatado: R$ 353.065,00
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numerico);
  };

  // LÓGICA DE FILTRAGEM
  const carrosFiltrados = carros.filter((carro: any) => 
    carro.marca.toLowerCase().includes(busca.toLowerCase()) || 
    carro.modelo.toLowerCase().includes(busca.toLowerCase())
  )

  //FUNÇÃO PARA CONSULTAR API EXTERNA
  const buscarPrecoFipe = async () => {
    if (!codigoFipe) return toast.error("Digite o código FIPE primeiro!");

    const idLoading = toast.loading("Buscando na base Parallelum...");
    
    try {
      const res = await fetch(`http://localhost:8080/api/externa/fipe/${codigoFipe.trim()}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data) && data.length > 0) {
        const veiculo = data[0];
        setMarca(veiculo.marca);
        setModelo(veiculo.modelo);
        setAno(veiculo.ano);
        
        // Mantém o valor como vem da API para o input (ex: 353.065,00)
        setPreco(veiculo.valor.replace("R$ ", "")); 
        
        toast.success("Veículo localizado!", { id: idLoading });
      } else {
        toast.error("Veículo não encontrado.", { id: idLoading });
      }
    } catch (error) {
      toast.error("Há um problema com a consulta, tente outro código.", { id: idLoading });
    }
  }

  // --- CRUD DA GARAGEM ---
  const carregarCarros = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/carros')
      if (res.ok) {
        const data = await res.json()
        setCarros(data)
      }
    } catch (err) {
      console.error("Erro ao carregar lista:", err)
    }
  }

  useEffect(() => {
    carregarCarros()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const dados = { marca, modelo, ano, preco }
    const url = idEditando ? `http://localhost:8080/api/carros/${idEditando}` : 'http://localhost:8080/api/carros'
    const metodo = idEditando ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    })

    if (response.ok) {
      toast.success(idEditando ? 'Dados atualizados!' : 'Salvo na garagem!');
      setIdEditando(null)
      setMarca(''); setModelo(''); setAno(''); setPreco(''); setCodigoFipe('')
      carregarCarros()
    } else {
      toast.error('Erro ao salvar no banco.')
    }
  }

  const prepararEdicao = (carro: any) => {
    setIdEditando(carro.id);
    setMarca(carro.marca);
    setModelo(carro.modelo);
    setAno(carro.ano);
    setPreco(carro.preco);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja remover este veículo?')) return
    const response = await fetch(`http://localhost:8080/api/carros/${id}`, { method: 'DELETE' })
    if (response.ok) {
      setCarros(carros.filter((carro: any) => carro.id !== id))
      toast.success('Veículo removido');
    }
  }

  return (
    <main className="p-6 md:p-12 bg-slate-950 min-h-screen text-slate-100">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-blue-500">🚗 Garage Tracker</h1>

        {/*FORMULÁRIO*/}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl mb-10">
          <h2 className="text-xl font-semibold mb-4 text-slate-300">
            {idEditando ? 'Editar Veículo' : 'Novo Cadastro'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex gap-2 mb-2">
              <input 
                className="flex-1 bg-slate-950 border border-slate-700 p-3 rounded-lg outline-none focus:ring-2 ring-blue-500"
                placeholder="Código Fipe (ex: 009164-2)"
                value={codigoFipe}
                onChange={(e) => setCodigoFipe(e.target.value)}
              />
              <button type="button" onClick={buscarPrecoFipe} className="bg-slate-800 hover:bg-slate-700 px-6 rounded-lg font-bold border border-slate-700">
                🔍 Consultar
              </button>
            </div>

            <input className="bg-slate-800 border border-slate-700 p-3 rounded-lg" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
            <input className="bg-slate-800 border border-slate-700 p-3 rounded-lg" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
            <input className="bg-slate-800 border border-slate-700 p-3 rounded-lg" placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} />
            <input className="bg-slate-800 border border-slate-700 p-3 rounded-lg" placeholder="Preço" value={preco} onChange={(e) => setPreco(e.target.value)} />
            
            <button type="submit" className={`md:col-span-2 font-bold py-3 rounded-lg transition ${idEditando ? 'bg-amber-600' : 'bg-blue-600 hover:bg-blue-500'}`}>
              {idEditando ? 'Salvar Alterações' : 'Adicionar à Garagem'}
            </button>
          </form>
        </section>

        {/*LISTAGEM*/}
        <div className="grid gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-slate-400">Veículos na Garagem</h2>
            <input 
              className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-sm outline-none focus:ring-2 ring-blue-500"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {carrosFiltrados.map((carro: any) => (
            <div key={carro.id} className="p-5 border border-slate-800 rounded-xl bg-slate-900/50 flex justify-between items-center hover:border-slate-700 transition">
              <div>
                <h3 className="text-lg font-bold">{carro.marca} {carro.modelo}</h3>
                {/*formatarMoeda(carro.preco) */}
                <p className="text-sm text-slate-500">
                  Ano: {carro.ano} • <span className="text-blue-400 font-semibold">{formatarMoeda(carro.preco)}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => prepararEdicao(carro)} className="p-2 bg-blue-900/20 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition">✏️</button>
                <button onClick={() => handleDelete(carro.id)} className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}