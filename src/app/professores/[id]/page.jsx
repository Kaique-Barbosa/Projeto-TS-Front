"use client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useState, useEffect } from "react";

export default function CadastrarAluno() {
  const [nome, setNome] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [telefone, setTelefone] = useState("");
  const [progressValue, setProgressValue] = useState(0); // Estado para controlar a barra de progresso
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento dos dados
  const params = useParams()
  const router = useRouter();

  const idProfessor = params.id; // Captura o valor de "matricula" da URL

  // Função para calcular o progresso baseado nos campos preenchidos
  useEffect(() => {
    
    if (idProfessor) {
      buscarProfessorParaAtualizar();
    }
    // return () => {
    //   second
    // }
  }, [idProfessor])
  

  // Lendo em tempo real os dados dos inputs e armazenando nos states
  const handleInputs = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "nome":
        setNome(value);
        break;
      case "area-atuacao":
        setAreaAtuacao(value);
        break;
      case "telefone":
        setTelefone(value);
        break;
      default:
        break;
    }
  };

  const atualizarProfessor = async (event) => {
    event.preventDefault();
    try {
      if (nome && areaAtuacao && telefone) {
        const data = { nome, areaAtuacao, telefone };
        const resposta = await axiosInstance.put(`/professor/${params.id}`, data);
        console.log("Professor cadastrado com sucesso", resposta.status);
        setNome("");
        setAreaAtuacao("");
        setTelefone("");
      }
      setTimeout(() => router.push("/professores"), 500);
    } catch (error) {
      console.log("Erro ao cadastrar professor", error);
    }
  };

  const buscarProfessorParaAtualizar = async () => {
    try {
      setProgressValue(0); // Reinicia a barra de progresso ao começar o carregamento
      let progress = 0;

      // Função que vai incrementar o valor da barra de progresso gradualmente
      const interval = setInterval(() => {
        progress += 5; // Aumenta a barra 5% por vez
        setProgressValue(progress);

        // Quando a barra atingir 100%, para a animação
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 60); // Executa a cada 60ms (para preencher a barra em 3 segundos)

      const resposta = await axiosInstance.get(`professor/listar/${idProfessor}`);
      const professor = resposta.data;

      // Atualiza os estados com os dados do aluno
      setNome(professor.nome);
      setAreaAtuacao(professor.areaAtuacao);
      setTelefone(professor.telefone);
      // Completa a animação da barra após os dados serem carregados
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Erro ao buscar Professor", error);
      setIsLoading(false);
    }
  };

  return (
    
    <div className="flex w-full items-center justify-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <h1 className="text-4xl font-bold">Cadastro de Professores</h1>
          <p className="text-lg">Id do professor: {params.id}</p>
        </div>

        {/* Exibe a barra de progresso enquanto o formulário está sendo preenchido */}
     {isLoading ? (
      
              <div className="flex justify-center mt-4">
              <progress
                className="progress progress-primary w-80"
                value={progressValue}
                max="100"
              ></progress>
            </div>
     ) : (
        <form
          onSubmit={atualizarProfessor}
          className="flex flex-col justify-center gap-4 w-[25rem] shadow-lg shadow-indigo-500/50 p-6 rounded-lg"
        >
          <div className="flex-1">
            <label className="block my-1">Nome</label>
            <input
              type="text"
              placeholder="Nome"
              name="nome"
              value={nome || ""}
              onChange={handleInputs}
              className="input input-bordered input-primary w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block my-1">Área de Atuação</label>
            <input
              type="text"
              placeholder="Digite sua área"
              name="area-atuacao"
              onChange={handleInputs}
              value={areaAtuacao || ""}
              className="input input-bordered input-primary text-gray-600 w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block my-1">Telefone</label>
            <input
              type="number"
              placeholder="Telefone"
              name="telefone"
              onChange={handleInputs}
              value={telefone || ""}
              className="input input-bordered input-primary w-full"
            />
          </div>
          <button
            type="submit"
            className="btn btn-outline btn-primary w-fit self-center"
          >
            Cadastrar
          </button>
          <div className="flex justify-around">
            <Link href={"/professores"} className="hover:underline">
              Lista de Professores
            </Link>
            <Link href={"/"} className="hover:underline">
              Voltar ao Home
            </Link>
          </div>
        </form>
     )}
   

      </main>
    </div>
  );
}
