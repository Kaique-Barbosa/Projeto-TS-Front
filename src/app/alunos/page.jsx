"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import AlertSucesso from "../components/AlertSucesso";

export default function listarAlunos() {
  const router = useRouter();
  const [data, setData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);



  const fetchData = async () => {
    try {
      const resposta = await axiosInstance.get("/aluno/listar");
      setData(resposta.data);
    } catch (error) {
      if (error.response) {
        // A resposta do servidor foi recebida, mas contém erro (status code diferente de 2xx)
        console.error("Erro de resposta:", error.response.status);
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error("Erro de requisição:", error.request);
      } else {
        // Outro tipo de erro ocorreu
        console.error("Erro ao configurar requisição:", error.message);
      }
    }
  };


  useEffect(() => {
    fetchData();
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const removerAluno = async (matricula) => {
    console.log("teste");
    setIsLoading(true)
    try {
      const resposta = await axiosInstance.delete(`/aluno/${matricula}`);
      console.log("Aluno deletado com sucesso");
      fetchData();
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      if (error.response) {
        // A resposta do servidor foi recebida, mas contém erro (status code diferente de 2xx)
        console.error("Erro de resposta:", error.response.status);
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error("Erro de requisição:", error.request);
      } else {
        // Outro tipo de erro ocorreu
        console.error("Erro ao configurar requisição:", error.message);
      }
    }
  };

  const corrigirData = (dados) => {
    const inverterData = (dados) => dados.split("-").reverse().join("/");

    const data = new Date(dados).toISOString().split("T")[0];
    const dataFormatada = inverterData(data);
    return dataFormatada; // Retorna a data no formato dd/mm/yyyy
  };
  

  if (isLoading) {
    return (
      <div className="flex w-full md:w-[80%] m-auto items-center justify-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
          <span className="loading loading-dots loading-lg"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-screen-xl m-auto items-center justify-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className=" flex justify-around w-full">
          <h1 className="text-4xl font-bold">Lista de Alunos</h1>
          <button
            onClick={() => {
              router.push("/alunos/cadastrar");
            }}
            className="btn btn-active btn-primary"
          >
            Cadastrar Aluno
          </button>
        </div>
        <div className="overflow-x-auto w-full shadow-lg shadow-indigo-500/50 p-2 rounded-lg">
          <table className="table table-zebra text-center">
            {/* head */}
            <thead>
              <tr className="text-black font-bold text-base">
                <th>Matrícula</th>
                <th>Nome</th>
                <th>Data Nascimento</th>
                <th>Turma</th>
              </tr>
            </thead>
            <tbody>
              {/* row  */}
              {data.map((aluno, index) => (
                <tr key={index}>
                  <th>{aluno.matricula}</th>
                  <td>{aluno.nome}</td>
                  <td>{corrigirData(aluno.dataNascimento)}</td>
                  <td>{aluno.turma.nome}</td>
                  <td>
                    <div className="flex items-center justify-center gap-5 my-2">

                      <button
                        onClick={() => {
                          const dataFormatada = new Date(aluno.dataNascimento).toISOString().split("T")[0]; // Formata para YYYY-MM-DD

                          router.push(
                            `/alunos/editar?matricula=${aluno.matricula}`
                          );
                        }}
                        className="btn btn-info"
                      >
                        Editar
                      </button>
 
                      <button
                        onClick={() => removerAluno(aluno.matricula)}
                        className="btn btn-error"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-around mt-10">
            <Link href={"/"} className="hover:underline">
              Voltar a home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
