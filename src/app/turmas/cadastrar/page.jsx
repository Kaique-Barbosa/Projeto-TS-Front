"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";

export default function CadastrarTurma() {
  const [nomeTurma, setNomeTurma] = useState("");
  const [periodoTurma, setPeriodoTurma] = useState("");
  const [profResponsavel, setProfResponsavel] = useState("");
  const router = useRouter();
  
  // Lendo em tempo real os dados dos inputs e armazenando nos states
  const handleInputs = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "nome-turma":
        setNomeTurma(value);
        break;
      case "periodo-turma":
        setPeriodoTurma(value);
        break;
      case "prof-responsavel":
        setProfResponsavel(value);
        break;
      default:
        break;
    }
  };

  const cadastrarTurma = async (event) => {
    event.preventDefault();
    try {
      if (nomeTurma && periodoTurma && profResponsavel) {
        const data = { nome: nomeTurma, periodo: periodoTurma, professor: parseInt(profResponsavel)};
        
        const resposta = await axiosInstance.post("/turma/cadastrar", data);
        console.log("Turma cadastrada com sucesso", resposta.status);
        setNomeTurma("");
        setPeriodoTurma("");
        setProfResponsavel("");
        setTimeout(() => router.push("/turmas"), 2000);
      }
    } catch (error) {
      console.log("Erro ao cadastrar turma", error);
    }
  };

  return (
    <div className="flex w-full items-center justify-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className="flex justify-around w-full">
          <h1 className="text-4xl font-bold">Cadastro de Turmas</h1>
        </div>

        <form
          onSubmit={cadastrarTurma}
          className="flex flex-col justify-center gap-4 w-[25rem] shadow-lg shadow-indigo-500/50 p-6 rounded-lg"
        >
          <div className="flex-1">
            <label className="block my-1">Nome da Turma</label>
            <input
              type="text"
              placeholder="Nome da Turma"
              name="nome-turma"
              onChange={handleInputs}
              value={nomeTurma || ""}
              className="input input-bordered input-primary text-black w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block my-1">Período</label>
            <input
              type="text"
              placeholder="Período"
              name="periodo-turma"
              onChange={handleInputs}
              value={periodoTurma || ""}
              className="input input-bordered input-primary text-black w-full"
            />
          </div>
          <div className="flex-1">
            <label className="block my-1">Professor Responsável</label>
            <input
              type="text"
              placeholder="ID do professor Responsável"
              name="prof-responsavel"
              onChange={handleInputs}
              value={profResponsavel || ""}
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
            <Link href={"/turmas"} className="hover:underline">
              Lista de Turmas
            </Link>
            <Link href={"/"} className="hover:underline">
              Voltar ao Home
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
