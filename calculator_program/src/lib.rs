use borsh::{BorshDeserialize, BorshSerialize};
use borsh_derive::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize)]
struct CalculatorAccount {
    number: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
enum Operator {
    Add,
    Sub,
    Mul,
    Div,
}

impl std::fmt::Display for Operator {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let symbol = match self {
            Operator::Add => "+",
            Operator::Sub => "-",
            Operator::Mul => "*",
            Operator::Div => "/",
        };
        write!(f, "{}", symbol)
    }
}

#[derive(BorshSerialize, BorshDeserialize)]
struct CalculatorInstruction {
    operator: Operator,
    operand: u32,
}

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!(&format!(
        "Welcome to the calculator program at {program_id}!"
    ));
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        msg!("Received account that is not owned by the program!");
        return Err(solana_program::program_error::ProgramError::IncorrectProgramId);
    }
    let mut calculator_account = CalculatorAccount::try_from_slice(&account.data.borrow())?;
    let calculator_instruction = CalculatorInstruction::try_from_slice(instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    msg!(&format!("Original number ({})", calculator_account.number));
    msg!(&format!(
        "Performing operation ({:?} {} {})",
        calculator_instruction.operator, calculator_account.number, calculator_instruction.operand
    ));
    match calculator_instruction.operator {
        Operator::Add => calculator_account.number += calculator_instruction.operand,
        Operator::Sub => calculator_account.number -= calculator_instruction.operand,
        Operator::Mul => calculator_account.number *= calculator_instruction.operand,
        Operator::Div => {
            if calculator_instruction.operand == 0 {
                return Err(ProgramError::InvalidInstructionData);
            } else {
                calculator_account.number /= calculator_instruction.operand;
            }
        }
    }

    msg!(&format!(
        "Final number value: {}",
        calculator_account.number
    ));
    calculator_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
    Ok(())
}
