"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";

export default function EditarAluno() {
  const searchParams = useSearchParams(); // Hook para capturar query parameters
  const router = useRouter();

  const matricula = searchParams.get("matricula"); // Captura o valor de "matricula" da URL

  // Estados com valores iniciais vazios
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [turma, setTurma] = useState("");
  const [turmas, setTurmas] = useState({});
  const [codTurma, setCodTurma] = useState("");
  const [progressValue, setProgressValue] = useState(0); // Estado para controlar a barra de progresso
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento dos dados

  // useEffect para buscar os dados do aluno assim que o componente monta
  useEffect(() => {
    if (matricula) {
      buscarAlunoParaAtualizar();
      buscarValoresDeTurmas();
    }
  }, [matricula]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "nome":
        setNome(value);
        break;
      case "data-de-nascimento":
        setDataNascimento(value);
        break;
      case "turma":
        setTurma(value);
        break;
      default:
        break;
    }
  };

  const buscarAlunoParaAtualizar = async () => {
    try {
      setProgressValue(0); // Reinicia a barra de progresso ao começar o carregamento
      let progress = 0;

      // Função que vai incrementar o valor da barra de progresso gradualmente
      const interval = setInterval(() => {
        progress += 5; // Aumenta a barra 2% por vez
        setProgressValue(progress);

        // Quando a barra atingir 100%, para a animação
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 60); // Executa a cada 60ms (para preencher a barra em 3 segundos)

      const resposta = await axiosInstance.get(`aluno/listar/${matricula}`);
      const aluno = resposta.data;

      // Converte a data para o formato yyyy-MM-dd
      const dataFormatada = new Date(aluno.dataNascimento)
        .toISOString()
        .split("T")[0];
      console.log(aluno.turma.codTurma);

      // Atualiza os estados com os dados do aluno
      setNome(aluno.nome);
      setDataNascimento(dataFormatada); // Define no formato correto
      setTurma(aluno.turma.nome);
      setCodTurma(aluno.turma.codTurma);

      // Completa a animação da barra após os dados serem carregados
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Erro ao buscar aluno", error);
      setIsLoading(false);
    }
  };

  const editarAluno = async (event) => {
    event.preventDefault();
    try {
      if (nome && dataNascimento && codTurma) {
        const dataFormatada = new Date(`${dataNascimento}T00:00:00Z`);

        const data = {
          nome,
          dataNascimento: dataFormatada,
          fk_turma_codTurma: codTurma,
        };
        const resposta = await axiosInstance.put(
          `/aluno/atualizar/${matricula}`,
          data
        );
        console.log("Aluno atualizado com sucesso", resposta.status);
        router.push("/alunos"); // Redireciona para a lista de alunos após a edição
      }
    } catch (error) {
      console.error("Erro ao atualizar aluno", error);
    }
  };

  const buscarValoresDeTurmas = async () => {
    try {
      const resposta = await axiosInstance.get("/turma/listar");

      const data = resposta.data;

      const turmas = data.map((turma) => {
        return {
          codTurma: turma.codTurma,
          nome: turma.nome,
        };
      });
      setTurmas(turmas);
    } catch (error) {
      console.error("Erro ao buscar turmas", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <h1 className="text-4xl font-bold">Edição de Alunos</h1>
          <p className="text-lg">Matrícula: {matricula}</p>
        </div>

        {/* Exibe a barra de progresso enquanto os dados estão sendo carregados */}
        {isLoading ? (
          <div className="flex justify-center mt-4">
            <progress
              className="progress progress-primary  w-80"
              value={progressValue}
              max="100"
            ></progress>
          </div>
        ) : (
          // Exibe o formulário somente após o carregamento
          <form
            onSubmit={editarAluno}
            className="flex flex-col justify-center gap-4 w-[25rem] shadow-lg shadow-indigo-500/50 p-6 rounded-lg "
          >
            <div className="flex-1">
              <label className="my-1 block">Nome</label>
              <input
                type="text"
                placeholder="Nome"
                name="nome"
                value={nome}
                onChange={handleInputs}
                className="input input-bordered input-primary w-full !text-black dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block my-1">Data de Nascimento</label>
              <input
                type="date"
                placeholder="Data de Nascimento"
                name="data-de-nascimento"
                value={dataNascimento}
                onChange={handleInputs}
                className="input input-bordered input-primary !text-gray-400 w-full dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block my-1">Turma</label>
              <select
                name="turma"
                value={turma}
                onChange={handleInputs}
                className="select select-bordered select-primary w-full"
              >
                {turmas.map((turma, index) => (
                  <option key={index} value={turma.codTurma}>
                    {turma.nome}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-outline btn-primary w-fit self-center"
            >
              Salvar Alterações
            </button>

            <div className="flex justify-around mt-4">
              <Link href={"/alunos"} className="link link-hover">
                Lista de Alunos
              </Link>
              <Link href={"/"} className="link link-hover">
                Voltar ao Home
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
