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

#[derive(BorshSerialize, BorshDeserialize)]
enum Operator {
    Add,
    Sub,
    Mul,
    Div,
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
    match calculator_instruction.operator {
        Operator::Add => {
            msg!(&format!(
                "Performing operation ({} + {})",
                calculator_account.number, calculator_instruction.operand
            ));
            calculator_account.number += calculator_instruction.operand;
        }
        Operator::Sub => {
            msg!(&format!(
                "Performing operation ({} - {})",
                calculator_account.number, calculator_instruction.operand
            ));
            calculator_account.number -= calculator_instruction.operand;
        }
        Operator::Mul => {
            msg!(&format!(
                "Performing operation ({} * {})",
                calculator_account.number, calculator_instruction.operand
            ));
            calculator_account.number *= calculator_instruction.operand;
        }
        Operator::Div => {
            if calculator_instruction.operand == 0 {
                msg!("Can't divide by 0!");
                return Err(ProgramError::InvalidInstructionData);
            } else {
                msg!(&format!(
                    "Performing operation ({} / {})",
                    calculator_account.number, calculator_instruction.operand
                ));
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
