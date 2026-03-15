import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://vitinb7.github.io/02-TesteAutomatizado/');
    await page.waitForLoadState('networkidle');
  });

  // =========================
  // CADASTRO DE ALUNOS
  // =========================

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);

      await expect(
        page.locator('#tabela-alunos tbody tr').filter({ hasText: 'João Silva' })
      ).toBeVisible();

    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado');

    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {

      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.getByText('Nenhum aluno cadastrado')).toBeVisible();

    });

  });

  // =========================
  // INTERFACE
  // =========================

  test.describe('Interface da Página', () => {

    test('deve exibir a seção de cadastro', async ({ page }) => {

      await expect(page.locator('#secao-cadastro')).toBeVisible();

    });

    test('campo nome deve ter placeholder correto', async ({ page }) => {

      await expect(page.getByLabel('Nome do Aluno')).toHaveAttribute(
        'placeholder',
        'Digite o nome completo'
      );

    });

    test('deve ter o título correto da página', async ({ page }) => {

      await expect(page).toHaveTitle(/QS Acadêmico/);

    });

    test('deve mostrar mensagem quando não há alunos', async ({ page }) => {

      await expect(page.getByText('Nenhum aluno cadastrado')).toBeVisible();

    });

  });

  // =========================
  // ESTATÍSTICAS
  // =========================

  test.describe('Estatísticas do sistema', () => {

    test('deve atualizar os cards corretamente', async ({ page }) => {

      for (let i = 1; i <= 3; i++) {

        await page.getByLabel('Nome do Aluno').fill(`Aluno ${i}`);
        await page.getByLabel('Nota 1').fill('8');
        await page.getByLabel('Nota 2').fill('8');
        await page.getByLabel('Nota 3').fill('8');

        await page.getByRole('button', { name: 'Cadastrar' }).click();

      }

      await expect(page.locator('#stat-total')).toHaveText('3');

    });

  });

  // =========================
  // CÁLCULO DE MÉDIAd
  // =========================

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média das três notas', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const celulaMedia = page
        .locator('#tabela-alunos tbody tr')
        .first()
        .locator('td')
        .nth(4);

      await expect(celulaMedia).toHaveText('7.00');

    });

  });

  // =========================
  // EXCLUSÃOdssdsdsdds
  // =========================

  test.describe('Exclusão de aluno', () => {

    test('deve excluir aluno da tabela', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Carlos');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('8');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('button', { name: 'Excluir' }).first().click();

      await expect(page.getByText('Nenhum aluno cadastrado')).toBeVisible();
    });

  });

  // =========================
  // SITUAÇÃO DO ALUNO
  // =========================

  test.describe('Situação do aluno', () => {

    test('Aprovado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Ana');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page
        .locator('#tabela-alunos tbody tr')
        .first()
        .locator('td')
        .nth(5);

      await expect(situacao).toHaveText('Aprovado');

    });

    test('Recuperação', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Bruno');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page
        .locator('#tabela-alunos tbody tr')
        .first()
        .locator('td')
        .nth(5);

      await expect(situacao).toHaveText('Recuperação');

    });

    test('Reprovado', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Lucas');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('2');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const situacao = page
        .locator('#tabela-alunos tbody tr')
        .first()
        .locator('td')
        .nth(5);

      await expect(situacao).toHaveText('Reprovado');

    });

  });

  // =========================
  // MÚLTIPLOS CADASTROS
  // =========================

  test.describe('Múltiplos cadastros', () => {

    test('deve cadastrar 3 alunos', async ({ page }) => {

      for (let i = 1; i <= 3; i++) {

        await page.getByLabel('Nome do Aluno').fill(`Aluno ${i}`);
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('7');
        await page.getByLabel('Nota 3').fill('7');

        await page.getByRole('button', { name: 'Cadastrar' }).click();

      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);

    });

  });

  // =========================
  // LIMPAR TUDO
  // =========================

  test.describe('Limpar Tudo', () => {

    test('deve apagar todos os alunos ao confirmar', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Teste');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      page.once('dialog', dialog => dialog.accept());

      await page.getByRole('button', { name: 'Limpar Tudo' }).click();

      await expect(page.getByText('Nenhum aluno cadastrado')).toBeVisible();

    });

    test('não deve apagar alunos ao cancelar', async ({ page }) => {

      await page.getByLabel('Nome do Aluno').fill('Teste');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      page.once('dialog', dialog => dialog.dismiss());

      await page.getByRole('button', { name: 'Limpar Tudo' }).click();

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);

    });

  });

});