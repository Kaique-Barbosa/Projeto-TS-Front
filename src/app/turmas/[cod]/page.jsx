"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useState, useEffect } from "react";

export default function EditarTurma() {
  const [codTurma, setCodTurma] = useState("");
  const [nomeTurma, setNomeTurma] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [professores, setProfessores] = useState([]);
  const [idProfessorResponsavel, setidProfessorResponsavel] = useState("");
  const [progressValue, setProgressValue] = useState(0); // Barra de progresso
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const router = useRouter();

  const idTurma = params.cod; // Captura o ID da turma da URL

  // Função para calcular o progresso baseado nos campos preenchidos
  useEffect(() => {
    if (idTurma) {
      buscarTurmaParaAtualizar();
      buscarProfessores();
    }
  }, [idTurma]);

  // Lendo em tempo real os dados dos inputs e armazenando nos states
  const handleInputs = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "cod-turma":
        setCodTurma(value);
        break;
      case "nome-turma":
        setNomeTurma(value);
        break;
      case "periodo":
        setPeriodo(value);
        break;
      case "professor-responsavel":
        setidProfessorResponsavel(value);
        break;
      default:
        break;
    }
  };

  const editarTurma = async (event) => {
    event.preventDefault();
    try {
      if (codTurma && nomeTurma && periodo && idProfessorResponsavel) {
        const data = {
          codTurma: parseInt(codTurma),
          nome: nomeTurma,
          periodo,
          professor: idProfessorResponsavel,
        };

        const resposta = await axiosInstance.put(
          `/turma/atualizar/${params.cod}`,
          data
        );
        console.log("Turma editada com sucesso", resposta.status);
        setCodTurma("");
        setNomeTurma("");
        setPeriodo("");
        setidProfessorResponsavel("");
      }
      setTimeout(() => router.push("/turmas"), 500); // Redireciona após a atualização
    } catch (error) {
      console.log("Erro ao editar turma", error);
    }
  };

  const buscarTurmaParaAtualizar = async () => {
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

      const resposta = await axiosInstance.get(`/turma/listar/${idTurma}`);
      const turma = resposta.data;
      console.log(turma);
      // Atualiza os estados com os dados da turma
      setCodTurma(turma.codTurma);
      setNomeTurma(turma.nome);
      setPeriodo(turma.periodo);
      setidProfessorResponsavel(turma.fk_professor_idprofessor);
      // Completa a animação da barra após os dados serem carregados
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Erro ao buscar Turma", error);
      setIsLoading(false);
    }
  };

  const buscarProfessores = async () => {
    try {
      const resposta = await axiosInstance.get("/professor/listar");
      const professores = resposta.data;
      setProfessores(
        professores.map((professor) => ({
          id: professor.idprofessor,
          nome: professor.nome,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar Professores", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <h1 className="text-4xl font-bold">Edição de Turma</h1>
          <p className="text-lg">ID da Turma: {params.cod}</p>
        </div>

        {/* Exibe a barra de progresso enquanto os dados estão sendo carregados */}
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
            onSubmit={editarTurma}
            className="flex flex-col justify-center gap-4 w-[25rem] shadow-lg shadow-indigo-500/50 p-6 rounded-lg"
          >
            <div className="flex-1">
              <label className="block my-1">Código da Turma</label>
              <input
                type="text"
                placeholder="Código da Turma"
                name="cod-turma"
                value={codTurma || ""}
                onChange={handleInputs}
                className="input input-bordered input-primary w-full text-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block my-1">Nome da Turma</label>
              <input
                type="text"
                placeholder="Nome da Turma"
                name="nome-turma"
                value={nomeTurma || ""}
                onChange={handleInputs}
                className="input input-bordered input-primary w-full text-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block my-1">Período</label>
              <input
                type="text"
                placeholder="Período"
                name="periodo"
                value={periodo || ""}
                onChange={handleInputs}
                className="input input-bordered input-primary w-full text-gray-600"
              />
            </div>
            <div className="flex-1">
              <label className="block my-1">Professor Responsável</label>
              <select
                name="professor-responsavel"
                value={idProfessorResponsavel}
                onChange={handleInputs}
                className="select select-bordered select-primary w-full"
              >
                {professores.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.nome}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-outline btn-primary w-fit self-center"
            >
              Atualizar
            </button>
            <div className="flex justify-around">
              <Link href={"/turmas"} className="link link-hover">
                Lista de Turmas
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
